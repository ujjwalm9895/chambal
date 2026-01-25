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
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, PostStatus } from '@prisma/client';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: any) {
    return this.postsService.create(createPostDto, user.id);
  }

  @Get()
  findAll(
    @Query('includeDrafts') includeDrafts?: string,
    @Query('status') status?: PostStatus,
    @Query('isSlider') isSlider?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('isBreaking') isBreaking?: string,
    @Query('isRecommended') isRecommended?: string,
    @Query('limit') limit?: string,
  ) {
    return this.postsService.findAll({
      includeDrafts: includeDrafts === 'true',
      status,
      isSlider: isSlider === 'true' ? true : isSlider === 'false' ? false : undefined,
      isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
      isBreaking: isBreaking === 'true' ? true : isBreaking === 'false' ? false : undefined,
      isRecommended: isRecommended === 'true' ? true : isRecommended === 'false' ? false : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  getStats() {
    return this.postsService.getStats();
  }

  @Get('public/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: any,
  ) {
    return this.postsService.update(id, updatePostDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @Post('bulk-upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UseInterceptors(FileInterceptor('file'))
  async bulkUpload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: any) {
    return this.postsService.bulkUpload(file, user.id);
  }

  @Get('bulk-upload/template')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async getTemplate(@Res() res: Response) {
    const csv = this.postsService.generateTemplate();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=bulk-post-template.csv');
    res.send(csv);
  }

  @Get('bulk-upload/example')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async getExample(@Res() res: Response) {
    const csv = this.postsService.generateExample();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=bulk-post-example.csv');
    res.send(csv);
  }
}
