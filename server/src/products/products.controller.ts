import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryType } from './enums/category.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Throttle({ default: { limit: 150, ttl: 60000 } })
  findAll(@Query('categoria') categoria?: CategoryType, @Query('search') search?: string) {
    return this.productsService.findAll(categoria, search);
  }

  @Get(':id')
  @Throttle({ default: { limit: 150, ttl: 60000 } })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  partialUpdate(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
