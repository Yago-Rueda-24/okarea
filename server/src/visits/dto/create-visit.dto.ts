import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVisitDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  path?: string;
}
