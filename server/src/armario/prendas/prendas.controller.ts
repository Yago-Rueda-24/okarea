import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrendasService } from './prendas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreatePrendaDto } from './dto/create-prenda.dto';
import { UpdatePrendaDto } from './dto/update-prenda.dto';
import { TipoPrenda } from './entities/prenda.entity';

@Controller('armario/prendas')
@UseGuards(JwtAuthGuard)
export class PrendasController {
  constructor(private readonly prendasService: PrendasService) {}

  @Post()
  @UseInterceptors(FileInterceptor('foto'))
  create(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePrendaDto,
  ) {
    return this.prendasService.create(user.id, file, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query('tipoPrenda') tipoPrenda?: TipoPrenda,
    @Query('temporada') temporada?: string,
    @Query('estilo') estilo?: string,
  ) {
    return this.prendasService.findAllByUser(user.id, { tipoPrenda, temporada, estilo });
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.prendasService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdatePrendaDto,
  ) {
    return this.prendasService.update(id, user.id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.prendasService.remove(id, user.id);
  }
}

