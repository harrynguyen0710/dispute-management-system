import type { HealthRepository } from '../interfaces/healthRepository.interface';
import type { HealthResponseDto } from '../dtos/health.dto';

export class HealthService {
  constructor(private readonly healthRepository: HealthRepository) {}

  async getHealth(): Promise<HealthResponseDto> {
    const status = await this.healthRepository.getStatus();
    return { status };
  }
}