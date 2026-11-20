import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOutfitItemDto {
  @IsString()
  @IsNotEmpty()
  prendaId: string;

  @IsString()
  @IsOptional()
  posicion?: string;
}

export class CreateOutfitRecommendedProductDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsOptional()
  comentario?: string;
}

export class CreateOutfitDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del outfit es obligatorio.' })
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

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
