import type { HealthRepository } from '../interfaces/healthRepository.interface';

export class InMemoryHealthRepository implements HealthRepository {
  async getStatus(): Promise<'ok'> {
    return 'ok';
  }
}