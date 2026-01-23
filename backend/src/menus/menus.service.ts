import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMenuDto) {
    const existing = await this.prisma.menu.findFirst({
      where: {
        OR: [{ name: dto.name }, { location: dto.location }],
      },
    });

    if (existing) {
      throw new ConflictException('Menu with this name or location already exists');
    }

    return this.prisma.menu.create({
      data: dto,
      include: {
        items: {
          orderBy: { order: 'asc' },
          include: {
            children: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.menu.findMany({
      include: {
        items: {
          where: { parentId: null },
          orderBy: { order: 'asc' },
          include: {
            children: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: {
        items: {
          where: { parentId: null },
          orderBy: { order: 'asc' },
          include: {
            children: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return menu;
  }

  async findByLocation(location: string) {
    return this.prisma.menu.findUnique({
      where: { location },
      include: {
        items: {
          where: { parentId: null },
          orderBy: { order: 'asc' },
          include: {
            children: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  async createMenuItem(dto: CreateMenuItemDto) {
    const menu = await this.prisma.menu.findUnique({
      where: { id: dto.menuId },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    if (dto.parentId) {
      const parent = await this.prisma.menuItem.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new NotFoundException('Parent menu item not found');
      }
    }

    return this.prisma.menuItem.create({
      data: dto,
    });
  }

  async updateMenuItem(id: string, dto: Partial<CreateMenuItemDto>) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: dto,
    });
  }

  async removeMenuItem(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    return this.prisma.menuItem.delete({
      where: { id },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.menu.delete({
      where: { id },
    });
  }
}
