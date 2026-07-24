import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller('health')
export class HealthController {
  @Get()
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  check() {
    return {
      status: 'ok',
      service: 'Okarea Catalog API',
      timestamp: new Date().toISOString(),
    };
  }
}
