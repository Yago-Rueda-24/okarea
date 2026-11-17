import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(idOrEmail?: string) {
    super(
      idOrEmail
        ? `Usuario '${idOrEmail}' no encontrado.`
        : 'Usuario no encontrado.',
    );
  }
}
