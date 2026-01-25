import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSiteSettingDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class UpdateSiteSettingDto {
  @IsString()
  @IsOptional()
  value?: string;
}
