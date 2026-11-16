import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrendasService } from '../prendas/prendas.service';
import { OutfitsService } from '../outfits/outfits.service';
import { RecomendarOutfitDto } from './dto/recomendar-outfit.dto';
import { Outfit } from '../outfits/entities/outfit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StylingRequest } from './entities/styling-request.entity';
import { CreateStylingRequestDto } from './dto/create-styling-request.dto';

@Injectable()
export class EstilismoService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prendasService: PrendasService,
    private readonly outfitsService: OutfitsService,
    @InjectRepository(StylingRequest)
    private readonly requestRepository: Repository<StylingRequest>,
  ) {}

  async createRequest(userId: string, dto: CreateStylingRequestDto) {
    const request = this.requestRepository.create({
      user: { id: userId } as any,
      occasion: dto.occasion.trim(),
      message: dto.message?.trim() || undefined,
    });
    const saved = await this.requestRepository.save(request);
    return { id: saved.id, occasion: saved.occasion, message: saved.message, status: saved.status, createdAt: saved.createdAt };
  }

  async listRequests(userId: string) {
    const requests = await this.requestRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
    return requests.map(({ id, occasion, message, status, createdAt }) => ({ id, occasion, message, status, createdAt }));
  }

  async listClients() {
    const clients = await this.usersService.findAllClients();
    return clients.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      email: c.email,
      preferenciasEstilo: c.preferenciasEstilo,
      totalPrendas: c.prendas?.length || 0,
      totalOutfits: c.outfits?.length || 0,
      createdAt: c.createdAt,
    }));
  }

  async getClientWardrobe(clientId: string) {
    const client = await this.usersService.findById(clientId);
    if (!client) {
      throw new NotFoundException(`Cliente con ID '${clientId}' no encontrado.`);
    }
    return this.prendasService.findAllByUser(clientId);
  }

  async getClientOutfits(clientId: string) {
    const client = await this.usersService.findById(clientId);
    if (!client) {
      throw new NotFoundException(`Cliente con ID '${clientId}' no encontrado.`);
    }
    return this.outfitsService.findAllByUser(clientId);
  }

  async recommendOutfit(
    clientId: string,
    dto: RecomendarOutfitDto,
    stylistId?: string,
  ): Promise<Outfit> {
    const client = await this.usersService.findById(clientId);
    if (!client) {
      throw new NotFoundException(`Cliente con ID '${clientId}' no encontrado.`);
    }

    return this.outfitsService.create(
      clientId,
      dto,
      stylistId,
      true, // esPropuestaEstilista
      dto.notaEstilista,
    );
  }
}

