import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryType } from './enums/category.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(categoria?: CategoryType, search?: string): Promise<Product[]> {
    const where: any = {};
    if (categoria) {
      where.categoria = categoria;
    }
    if (search) {
      where.nombre = ILike(`%${search}%`);
    }
    return this.productRepository.find({
      where,
      relations: { category: true, photos: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const where: any = isUuid
      ? { id }
      : { nombre: ILike(`%${id.replace(/-/g, ' ')}%`) };

    const product = await this.productRepository.findOne({
      where,
      relations: { category: true, photos: true },
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID '${id}' no encontrado.`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, ...rest } = createProductDto;
    const product = this.productRepository.create(rest);

    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: categoryId });
      if (category) {
        product.category = category;
      }
    }

    return this.productRepository.save(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { categoryId, ...rest } = updateProductDto;

    Object.assign(product, rest);

    if (categoryId !== undefined) {
      if (categoryId) {
        const category = await this.categoryRepository.findOneBy({ id: categoryId });
        if (category) {
          product.category = category;
        }
      } else {
        product.category = null;
      }
    }

    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
