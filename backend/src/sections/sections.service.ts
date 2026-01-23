import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSectionDto) {
    // Verify page exists
    const page = await this.prisma.page.findUnique({
      where: { id: dto.pageId },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    // Get max order for this page
    const maxOrder = await this.prisma.section.findFirst({
      where: { pageId: dto.pageId },
      orderBy: { order: 'desc' },
    });

    const order = dto.order !== undefined ? dto.order : (maxOrder?.order ?? -1) + 1;

    // Shift existing sections if needed
    if (dto.order !== undefined) {
      await this.shiftSections(dto.pageId, order);
    }

    return this.prisma.section.create({
      data: {
        pageId: dto.pageId,
        type: dto.type,
        order,
        content: dto.content,
      },
    });
  }

  async findAll(pageId: string) {
    return this.prisma.section.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const section = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    return section;
  }

  async update(id: string, dto: UpdateSectionDto) {
    const section = await this.findOne(id);

    // If order is being updated, shift sections
    if (dto.order !== undefined && dto.order !== section.order) {
      await this.shiftSections(section.pageId, dto.order, id);
    }

    return this.prisma.section.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async remove(id: string) {
    const section = await this.findOne(id);
    const pageId = section.pageId;

    await this.prisma.section.delete({
      where: { id },
    });

    // Reorder remaining sections
    await this.reorderSectionsAfterDelete(pageId);
  }

  async reorder(dto: ReorderSectionsDto) {
    const updates = dto.sections.map((item) =>
      this.prisma.section.update({
        where: { id: item.id },
        data: { order: parseInt(item.order.toString()) },
      }),
    );

    await this.prisma.$transaction(updates);
    return { message: 'Sections reordered successfully' };
  }

  private async shiftSections(pageId: string, newOrder: number, excludeId?: string) {
    const where: any = {
      pageId,
      order: { gte: newOrder },
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    await this.prisma.section.updateMany({
      where,
      data: {
        order: { increment: 1 },
      },
    });
  }

  private async reorderSectionsAfterDelete(pageId: string) {
    const sections = await this.prisma.section.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
    });

    const updates = sections.map((section, index) =>
      this.prisma.section.update({
        where: { id: section.id },
        data: { order: index },
      }),
    );

    if (updates.length > 0) {
      await this.prisma.$transaction(updates);
    }
  }
}
