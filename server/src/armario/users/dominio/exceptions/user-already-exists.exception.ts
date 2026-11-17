import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistsException extends ConflictException {
  constructor(email?: string) {
    super(
      email
        ? `El correo electrónico '${email}' ya está registrado.`
        : 'El correo electrónico ya está registrado.',
    );
  }
}
