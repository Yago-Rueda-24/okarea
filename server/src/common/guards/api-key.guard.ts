import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers['x-api-key'];
    const authHeader = request.headers['authorization'];

    const validApiKey = this.configService.get<string>('ADMIN_API_KEY') || 'okarea_secret_admin_key_2026';

    const providedKey = apiKeyHeader || (authHeader ? authHeader.replace(/^Bearer\s+/i, '').replace(/^Api-Key\s+/i, '') : null);

    if (!providedKey || providedKey !== validApiKey) {
      throw new UnauthorizedException('Acceso no autorizado: API Key no válida o ausente');
    }
    return true;
  }
}
