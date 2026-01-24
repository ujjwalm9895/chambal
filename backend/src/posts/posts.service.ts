import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus, Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePostDto, userId: string) {
    const existingPost = await this.prisma.post.findUnique({
      where: { slug: dto.slug },
    });

    if (existingPost) {
      throw new ConflictException('Post with this slug already exists');
    }

    return this.prisma.post.create({
      data: {
        ...dto,
        status: dto.status || PostStatus.DRAFT,
        publishedAt: dto.status === PostStatus.PUBLISHED ? new Date().toISOString() : undefined,
        createdById: userId,
        updatedById: userId,
      },
    });
  }

  async findAll(params: {
    includeDrafts?: boolean;
    status?: PostStatus;
    isSlider?: boolean;
    isFeatured?: boolean;
    isBreaking?: boolean;
    isRecommended?: boolean;
    limit?: number;
  }) {
    const { includeDrafts, status, isSlider, isFeatured, isBreaking, isRecommended, limit } = params;
    
    const where: Prisma.PostWhereInput = {};

    // Status filtering
    if (status) {
      where.status = status;
    } else if (!includeDrafts) {
      where.status = PostStatus.PUBLISHED;
    }

    // Boolean flags filtering
    if (isSlider !== undefined) where.isSlider = isSlider;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;
    if (isBreaking !== undefined) where.isBreaking = isBreaking;
    if (isRecommended !== undefined) where.isRecommended = isRecommended;

    return this.prisma.post.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: { category: true },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug, status: PostStatus.PUBLISHED },
      include: { category: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: string, dto: UpdatePostDto, userId: string) {
    const post = await this.findOne(id);

    if (dto.slug && dto.slug !== post.slug) {
      const existingPost = await this.prisma.post.findUnique({
        where: { slug: dto.slug },
      });

      if (existingPost) {
        throw new ConflictException('Post with this slug already exists');
      }
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        ...dto,
        updatedById: userId,
        publishedAt: dto.status === PostStatus.PUBLISHED && !post.publishedAt ? new Date().toISOString() : post.publishedAt,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.post.delete({
      where: { id },
    });
  }

  async getStats() {
    const totalPosts = await this.prisma.post.count();
    const publishedPosts = await this.prisma.post.count({ where: { status: PostStatus.PUBLISHED } });
    const drafts = await this.prisma.post.count({ where: { status: PostStatus.DRAFT } });
    const pendingPosts = await this.prisma.post.count({ where: { status: PostStatus.PENDING } });
    const scheduled = await this.prisma.post.count({ where: { status: PostStatus.SCHEDULED } });

    return {
      totalPosts,
      publishedPosts,
      drafts,
      pendingPosts,
      scheduled,
    };
  }
}
