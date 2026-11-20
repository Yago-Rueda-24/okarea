import { NotFoundException } from '@nestjs/common';

export class PrendaNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Prenda con ID '${id}' no encontrada.`);
  }
}
