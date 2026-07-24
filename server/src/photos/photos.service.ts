import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { Product } from '../products/entities/product.entity';
import { S3Service } from '../common/s3.service';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly s3Service: S3Service,
  ) {}

  async findByProduct(productId: string): Promise<Photo[]> {
    return this.photoRepository.find({
      where: { product: { id: productId } },
      order: { isMain: 'DESC', createdAt: 'DESC' },
    });
  }

  async uploadPhoto(productId: string, file: Express.Multer.File, isMain = false): Promise<Photo> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Producto con ID '${productId}' no encontrado.`);
    }

    const { s3Key, url } = await this.s3Service.uploadFile(file, `products/${productId}`);

    if (isMain) {
      await this.clearMainPhoto(productId);
    }

    const photo = this.photoRepository.create({
      filename: file.originalname,
      s3Key,
      url,
      isMain,
      product,
    });

    return this.photoRepository.save(photo);
  }

  async setMainPhoto(productId: string, photoId: string): Promise<Photo> {
    await this.clearMainPhoto(productId);

    const photo = await this.photoRepository.findOne({
      where: { id: photoId, product: { id: productId } },
    });
    if (!photo) {
      throw new NotFoundException(`Foto con ID '${photoId}' no encontrada.`);
    }

    photo.isMain = true;
    return this.photoRepository.save(photo);
  }

  async deletePhoto(productId: string, photoId: string): Promise<void> {
    const photo = await this.photoRepository.findOne({
      where: { id: photoId, product: { id: productId } },
    });
    if (!photo) {
      throw new NotFoundException(`Foto con ID '${photoId}' no encontrada.`);
    }

    await this.s3Service.deleteFile(photo.s3Key);
    await this.photoRepository.remove(photo);
  }

  private async clearMainPhoto(productId: string): Promise<void> {
    await this.photoRepository.update(
      { product: { id: productId } },
      { isMain: false },
    );
  }
}
