import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageStatus } from '@prisma/client';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePageDto, userId: string) {
    // Check if slug already exists
    const existingPage = await this.prisma.page.findUnique({
      where: { slug: dto.slug },
    });

    if (existingPage) {
      throw new ConflictException('Page with this slug already exists');
    }

    return this.prisma.page.create({
      data: {
        ...dto,
        status: dto.status || PageStatus.DRAFT,
        createdById: userId,
        updatedById: userId,
      },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findAll(includeDrafts = false) {
    const where = includeDrafts ? {} : { status: PageStatus.PUBLISHED };

    return this.prisma.page.findMany({
      where,
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const page = await this.prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.page.findUnique({
      where: { slug, status: PageStatus.PUBLISHED },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async update(id: string, dto: UpdatePageDto, userId: string) {
    const page = await this.findOne(id);

    // Check slug uniqueness if slug is being updated
    if (dto.slug && dto.slug !== page.slug) {
      const existingPage = await this.prisma.page.findUnique({
        where: { slug: dto.slug },
      });

      if (existingPage) {
        throw new ConflictException('Page with this slug already exists');
      }
    }

    return this.prisma.page.update({
      where: { id },
      data: {
        ...dto,
        updatedById: userId,
      },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.page.delete({
      where: { id },
    });
  }
}
