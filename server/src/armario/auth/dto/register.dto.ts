import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El formato del email no es válido.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @IsString()
  @MinLength(6, { message: 'La confirmación de la contraseña debe tener al menos 6 caracteres.' })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  nombre: string;
}
