import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TipoPrenda } from '../../dominio/enums/tipo-prenda.enum';

export class UpdatePrendaDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsEnum(TipoPrenda)
  @IsOptional()
  tipoPrenda?: TipoPrenda;

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
