import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateStylingRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Indica la ocasión o motivo de tu solicitud.' })
  @MaxLength(120)
  occasion: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  message?: string;
}
