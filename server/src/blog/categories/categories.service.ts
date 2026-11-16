import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: { products: true } });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: [{ id }, { slug: id }],
      relations: { products: true },
    });
    if (!category) {
      throw new NotFoundException(`Categoría con ID o slug '${id}' no encontrada.`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const slug = createCategoryDto.slug || createCategoryDto.name.toLowerCase().replace(/\s+/g, '-');
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      slug,
    });
    return this.categoryRepository.save(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (updateCategoryDto.name && !updateCategoryDto.slug) {
      updateCategoryDto.slug = updateCategoryDto.name.toLowerCase().replace(/\s+/g, '-');
    }
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
