import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiteSettingDto } from './dto/create-site-setting.dto';
import { UpdateSiteSettingDto } from './dto/update-site-setting.dto';

@Injectable()
export class SiteSettingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSiteSettingDto) {
    return this.prisma.siteSettings.create({
      data: dto,
    });
  }

  async findAll() {
    const settings = await this.prisma.siteSettings.findMany({
      orderBy: { key: 'asc' },
    });
    
    // Convert array to object for easier access
    const settingsObj: Record<string, string> = {};
    settings.forEach((setting) => {
      settingsObj[setting.key] = setting.value;
    });
    
    return settingsObj;
  }

  async findByKey(key: string) {
    const setting = await this.prisma.siteSettings.findUnique({
      where: { key },
    });

    if (!setting) {
      return null;
    }

    return setting.value;
  }

  async update(key: string, dto: UpdateSiteSettingDto) {
    const existing = await this.prisma.siteSettings.findUnique({
      where: { key },
    });

    if (!existing) {
      return this.prisma.siteSettings.create({
        data: { key, value: dto.value || '' },
      });
    }

    return this.prisma.siteSettings.update({
      where: { key },
      data: dto,
    });
  }

  async upsert(key: string, value: string) {
    return this.prisma.siteSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async remove(key: string) {
    const setting = await this.prisma.siteSettings.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException('Setting not found');
    }

    return this.prisma.siteSettings.delete({
      where: { key },
    });
  }
}
