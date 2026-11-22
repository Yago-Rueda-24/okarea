import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateAsesoriaDto {
  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener el formato YYYY-MM-DD',
  })
  fecha: string;

  @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
    message: 'La hora de inicio debe tener el formato HH:mm',
  })
  horaInicio: string;

  @IsNotEmpty({ message: 'Debe indicar qué desea o necesita en la asesoría' })
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  @MinLength(5, { message: 'El texto descriptivo debe tener al menos 5 caracteres' })
  motivo: string;
}
