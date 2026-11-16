import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import * as crypto from 'crypto';
import { Visit } from './entities/visit.entity';
import { CreateVisitDto } from './dto/create-visit.dto';

const BOT_PATTERNS = /bot|crawler|spider|slurp|curl|fetch|python|postman|wget|headless/i;
const COOLDOWN_MINUTES = 5;

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
  ) {}

  private hashIp(ip: string): string {
    const salt = 'okarea_analytics_salt';
    return crypto.createHash('sha256').update(`${salt}:${ip || 'unknown'}`).digest('hex');
  }

  private isBot(userAgent: string): boolean {
    if (!userAgent) return false;
    return BOT_PATTERNS.test(userAgent);
  }

  async recordVisit(
    dto: CreateVisitDto,
    rawIp: string,
    userAgent: string,
  ): Promise<{ recorded: boolean; reason?: string }> {
    if (this.isBot(userAgent)) {
      return { recorded: false, reason: 'bot_ignored' };
    }

    const path = dto.path || '/';
    const ipHash = this.hashIp(rawIp);

    // Cooldown check (5 minutos)
    const fiveMinutesAgo = new Date(Date.now() - COOLDOWN_MINUTES * 60 * 1000);
    const recentVisit = await this.visitRepository.findOne({
      where: {
        ipHash,
        path,
        createdAt: MoreThanOrEqual(fiveMinutesAgo),
      },
    });

    if (recentVisit) {
      return { recorded: false, reason: 'cooldown' };
    }

    const visit = this.visitRepository.create({
      path,
      ipHash,
      userAgent: userAgent ? userAgent.substring(0, 255) : null,
    });

    await this.visitRepository.save(visit);
    return { recorded: true };
  }

  async getStats(): Promise<{
    totalVisits: number;
    todayVisits: number;
    uniqueVisitorsTotal: number;
    uniqueVisitorsToday: number;
    topPages: { path: string; visits: number }[];
  }> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const totalVisits = await this.visitRepository.count();

    const todayVisits = await this.visitRepository.count({
      where: {
        createdAt: MoreThanOrEqual(startOfToday),
      },
    });

    const uniqueTotalResult = await this.visitRepository
      .createQueryBuilder('visit')
      .select('COUNT(DISTINCT visit.ipHash)', 'count')
      .getRawOne();

    const uniqueTodayResult = await this.visitRepository
      .createQueryBuilder('visit')
      .select('COUNT(DISTINCT visit.ipHash)', 'count')
      .where('visit.createdAt >= :startOfToday', { startOfToday })
      .getRawOne();

    const topPagesResult = await this.visitRepository
      .createQueryBuilder('visit')
      .select('visit.path', 'path')
      .addSelect('COUNT(visit.id)', 'visits')
      .groupBy('visit.path')
      .orderBy('visits', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      totalVisits: Number(totalVisits || 0),
      todayVisits: Number(todayVisits || 0),
      uniqueVisitorsTotal: Number(uniqueTotalResult?.count || 0),
      uniqueVisitorsToday: Number(uniqueTodayResult?.count || 0),
      topPages: topPagesResult.map((p) => ({
        path: p.path || '/',
        visits: Number(p.visits || 0),
      })),
    };
  }
}
