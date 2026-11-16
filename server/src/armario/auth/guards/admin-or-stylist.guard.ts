import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class AdminOrStylistGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers['x-api-key'];
    const validApiKey = this.configService.get<string>('ADMIN_API_KEY') || 'okarea_secret_admin_key_2026';

    // 1. Check if valid API Key is provided (e.g. Electron Admin Desktop)
    if (apiKeyHeader && apiKeyHeader === validApiKey) {
      return true;
    }

    // 2. Otherwise check JWT bearer token
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET', 'okarea_armario_secret_key_change_in_production'),
        });
        const user = await this.usersService.findById(payload.sub);
        if (user && (user.role === UserRole.ADMIN || user.role === UserRole.STYLIST)) {
          request.user = user;
          return true;
        }
      } catch (err) {
        throw new UnauthorizedException('Token no válido o expirado.');
      }
    }

    throw new UnauthorizedException('Acceso restringido a administradores o estilistas.');
  }
}

