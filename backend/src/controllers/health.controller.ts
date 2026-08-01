import type { Request, Response, NextFunction } from 'express';
import type { HealthService } from '../services/health.service';

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  getHealth = async (_request: Request, response: Response, next: NextFunction) => {
    try {
      const health = await this.healthService.getHealth();
      response.json(health);
    } catch (error) {
      next(error);
    }
  };
}