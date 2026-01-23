import { IsString, IsNotEmpty, IsEnum, IsInt, IsObject, Min } from 'class-validator';
import { SectionType } from '@prisma/client';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  pageId: string;

  @IsEnum(SectionType)
  type: SectionType;

  @IsInt()
  @Min(0)
  order: number;

  @IsObject()
  content: Record<string, any>;
}
