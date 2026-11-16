import { IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  titulo: string;

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
