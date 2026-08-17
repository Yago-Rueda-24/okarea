import { Body, Controller, Get, Headers, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CreateVisitDto } from './dto/create-visit.dto';
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async recordVisit(
    @Body() dto: CreateVisitDto,
    @Req() req: Record<string, any>,
    @Headers('user-agent') userAgent: string,
  ) {
    const rawIp =
      (req.headers?.['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      '';

    return this.visitsService.recordVisit(dto, rawIp, userAgent);
  }

  @Get('stats')
  @UseGuards(ApiKeyGuard)
  async getStats() {
    return this.visitsService.getStats();
  }
}
