import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../enums/category.enum';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsEnum(CategoryType)
  @IsOptional()
  categoria?: CategoryType;

  @IsString()
  @IsOptional()
  fabricante?: string;

  @IsString()
  @IsOptional()
  tienda?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  temporada?: string;

  @IsString()
  @IsOptional()
  precio?: string;

  @IsString()
  @IsOptional()
  enlaceSitio?: string;

  @IsString()
  @IsOptional()
  imagenUrl?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}
