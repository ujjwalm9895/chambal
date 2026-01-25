import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { AdPosition, AdStatus } from '@prisma/client';

@Injectable()
export class AdvertisementsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAdvertisementDto) {
    return this.prisma.advertisement.create({
      data: {
        ...dto,
        status: dto.status || AdStatus.ACTIVE,
        order: dto.order || 0,
      },
    });
  }

  async findAll(position?: AdPosition) {
    const where: any = {
      status: AdStatus.ACTIVE,
    };

    if (position) {
      where.position = position;
    }

    const now = new Date();
    return this.prisma.advertisement.findMany({
      where: {
        ...where,
        OR: [
          { startDate: null },
          { startDate: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      orderBy: { order: 'asc' },
    });
  }

  async findAllForAdmin() {
    return this.prisma.advertisement.findMany({
      orderBy: [{ position: 'asc' }, { order: 'asc' }],
    });
  }

  async findOne(id: string) {
    const ad = await this.prisma.advertisement.findUnique({
      where: { id },
    });

    if (!ad) {
      throw new NotFoundException('Advertisement not found');
    }

    return ad;
  }

  async update(id: string, dto: UpdateAdvertisementDto) {
    await this.findOne(id);
    return this.prisma.advertisement.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.advertisement.delete({
      where: { id },
    });
  }
}
