export interface HealthRepository {
  getStatus(): Promise<'ok'>;
}