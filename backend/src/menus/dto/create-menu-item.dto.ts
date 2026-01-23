import { IsString, IsNotEmpty, IsInt, IsOptional, Min } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  menuId: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsInt()
  @Min(0)
  order: number;

  @IsOptional()
  @IsString()
  parentId?: string;
}
