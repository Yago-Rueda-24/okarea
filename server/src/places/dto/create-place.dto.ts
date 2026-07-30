import { IsOptional, IsString } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  lugar?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  foto?: string;

  @IsString()
  @IsOptional()
  enlace?: string;
}
