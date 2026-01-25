import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsDateString, IsUrl } from 'class-validator';
import { AdPosition, AdStatus } from '@prisma/client';

export class CreateAdvertisementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  linkUrl?: string;

  @IsEnum(AdPosition)
  position: AdPosition;

  @IsEnum(AdStatus)
  @IsOptional()
  status?: AdStatus;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
