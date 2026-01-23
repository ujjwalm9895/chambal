import { IsArray, IsString, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class SectionOrder {
  @IsString()
  id: string;

  @IsInt()
  order: number;
}

export class ReorderSectionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionOrder)
  sections: SectionOrder[];
}
