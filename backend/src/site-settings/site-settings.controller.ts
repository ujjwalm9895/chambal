import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { CreateSiteSettingDto } from './dto/create-site-setting.dto';
import { UpdateSiteSettingDto } from './dto/update-site-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createSiteSettingDto: CreateSiteSettingDto) {
    return this.siteSettingsService.create(createSiteSettingDto);
  }

  @Get()
  findAll() {
    return this.siteSettingsService.findAll();
  }

  @Get(':key')
  findByKey(@Param('key') key: string) {
    return this.siteSettingsService.findByKey(key);
  }

  @Patch(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('key') key: string,
    @Body() updateSiteSettingDto: UpdateSiteSettingDto,
  ) {
    return this.siteSettingsService.update(key, updateSiteSettingDto);
  }

  @Post('upsert')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  upsert(@Body() body: { key: string; value: string }) {
    return this.siteSettingsService.upsert(body.key, body.value);
  }

  @Delete(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('key') key: string) {
    return this.siteSettingsService.remove(key);
  }
}
