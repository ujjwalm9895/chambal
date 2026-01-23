import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
  private uploadPath: string;
  private baseUrl: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.uploadPath = this.configService.get<string>('MEDIA_UPLOAD_PATH') || './uploads';
    this.baseUrl = this.configService.get<string>('MEDIA_BASE_URL') || 'http://localhost:3000/uploads';

    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
    const filePath = path.join(this.uploadPath, filename);
    const url = `${this.baseUrl}/${filename}`;

    // Save file
    fs.writeFileSync(filePath, file.buffer);

    // Save metadata to database
    const media = await this.prisma.media.create({
      data: {
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: filePath,
        url,
        uploadedById: userId,
      },
    });

    return media;
  }

  async findAll() {
    return this.prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.media.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new BadRequestException('Media not found');
    }

    // Delete file from filesystem
    if (fs.existsSync(media.path)) {
      fs.unlinkSync(media.path);
    }

    // Delete from database
    return this.prisma.media.delete({
      where: { id },
    });
  }
}
