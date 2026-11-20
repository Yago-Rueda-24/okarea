import { NotFoundException } from '@nestjs/common';

export class OutfitNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Outfit con ID '${id}' no encontrado.`);
  }
}
