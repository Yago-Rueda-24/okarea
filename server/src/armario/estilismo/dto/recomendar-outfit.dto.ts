import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateOutfitItemDto, CreateOutfitRecommendedProductDto } from '../../outfits/controller/dto/create-outfit.dto';

export class RecomendarOutfitDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del outfit es requerido.' })
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsNotEmpty({ message: 'La nota o consejo del estilista es importante.' })
  notaEstilista: string;

  @IsString()
  @IsOptional()
  ocasion?: string;

  @IsString()
  @IsOptional()
  temporada?: string;

  @IsArray()
  @IsOptional()
  items?: CreateOutfitItemDto[];

  @IsArray()
  @IsOptional()
  productosRecomendados?: CreateOutfitRecommendedProductDto[];
}
