import { IsOptional, IsString } from 'class-validator';

export class UpdatePlaceDto {
  @IsString()
  @IsOptional()
  nombre?: string;

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
