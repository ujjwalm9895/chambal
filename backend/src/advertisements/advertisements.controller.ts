import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdvertisementsService } from './advertisements.service';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, AdPosition } from '@prisma/client';

@Controller('advertisements')
export class AdvertisementsController {
  constructor(private readonly advertisementsService: AdvertisementsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createAdvertisementDto: CreateAdvertisementDto) {
    return this.advertisementsService.create(createAdvertisementDto);
  }

  @Get()
  findAll(@Query('position') position?: AdPosition) {
    if (position) {
      return this.advertisementsService.findAll(position);
    }
    return this.advertisementsService.findAllForAdmin();
  }

  @Get('public')
  findPublic(@Query('position') position?: AdPosition) {
    return this.advertisementsService.findAll(position);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.advertisementsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateAdvertisementDto: UpdateAdvertisementDto,
  ) {
    return this.advertisementsService.update(id, updateAdvertisementDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.advertisementsService.remove(id);
  }
}
