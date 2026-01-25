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

  async bulkUpload(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const csvContent = file.buffer.toString('utf-8');
    const lines = csvContent.split('\n').filter((line) => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const dataRows = lines.slice(1);

    let created = 0;
    let errors = 0;
    const errorMessages: string[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const values = this.parseCSVRow(row);
      
      if (values.length !== headers.length) {
        errors++;
        errorMessages.push(`Row ${i + 2}: Column count mismatch`);
        continue;
      }

      const rowData: any = {};
      headers.forEach((header, index) => {
        rowData[header] = values[index]?.trim() || '';
      });

      try {
        // Generate slug from title if not provided
        if (!rowData.slug && rowData.title) {
          rowData.slug = rowData.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }

        // Map CSV values to post data
        const postData: CreatePostDto = {
          title: rowData.title || '',
          slug: rowData.slug || '',
          content: rowData.content || '',
          excerpt: rowData.excerpt || rowData.summary || '',
          featuredImage: rowData.featuredimage || rowData.image || '',
          imageDescription: rowData.imagedescription || '',
          metaKeywords: rowData.metakeywords || rowData.keywords || '',
          status: this.mapStatus(rowData.status),
          isSlider: this.parseBoolean(rowData.isslider || rowData.slider),
          isFeatured: this.parseBoolean(rowData.isfeatured || rowData.featured),
          isBreaking: this.parseBoolean(rowData.isbreaking || rowData.breaking),
          isRecommended: this.parseBoolean(rowData.isrecommended || rowData.recommended),
          categoryId: rowData.categoryid || rowData.category || null,
        };

        if (!postData.title || !postData.slug) {
          errors++;
          errorMessages.push(`Row ${i + 2}: Title and Slug are required`);
          continue;
        }

        await this.create(postData, userId);
        created++;
      } catch (error: any) {
        errors++;
        errorMessages.push(`Row ${i + 2}: ${error.message || 'Unknown error'}`);
      }
    }

    return {
      created,
      errors,
      total: dataRows.length,
      errorMessages: errorMessages.slice(0, 10), // Limit to first 10 errors
    };
  }

  private parseCSVRow(row: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    return values;
  }

  private parseBoolean(value: string): boolean {
    if (!value) return false;
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === '1' || lower === 'yes';
  }

  private mapStatus(status: string): PostStatus {
    if (!status) return PostStatus.DRAFT;
    const upper = status.toUpperCase().trim();
    if (upper === 'PUBLISHED' || upper === 'PUBLISH') return PostStatus.PUBLISHED;
    if (upper === 'PENDING') return PostStatus.PENDING;
    if (upper === 'SCHEDULED') return PostStatus.SCHEDULED;
    return PostStatus.DRAFT;
  }

  generateTemplate(): string {
    return `title,slug,content,excerpt,featuredImage,imageDescription,metaKeywords,status,isSlider,isFeatured,isBreaking,isRecommended,categoryId
"Sample Post Title","sample-post-slug","<p>Post content here</p>","This is a sample excerpt","https://example.com/image.jpg","Image description","keyword1, keyword2","DRAFT","false","false","false","false",""
`;
  }

  generateExample(): string {
    return `title,slug,content,excerpt,featuredImage,imageDescription,metaKeywords,status,isSlider,isFeatured,isBreaking,isRecommended,categoryId
"Breaking News: Major Event","breaking-news-major-event","<p>This is the full content of the breaking news article.</p>","A brief summary of the breaking news","https://example.com/news.jpg","Breaking news image","news, breaking, event","PUBLISHED","true","true","true","false",""
"Featured Article","featured-article","<p>This is a featured article content.</p>","Summary of featured article","https://example.com/featured.jpg","Featured article image","featured, article","PUBLISHED","false","true","false","true",""
`;
  }
}
