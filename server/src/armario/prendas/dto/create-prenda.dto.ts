import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TipoPrenda } from '../entities/prenda.entity';

export class CreatePrendaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la prenda es requerido.' })
  nombre: string;

  @IsEnum(TipoPrenda, { message: 'El tipo de prenda debe ser superior, inferior, calzado, abrigo, accesorio u otro.' })
  tipoPrenda: TipoPrenda;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  temporada?: string;

  @IsString()
  @IsOptional()
  estilo?: string;

  @IsOptional()
  notasAdicionales?: any;
}

