import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';
import { HealthService } from '../services/health.service';
import { InMemoryHealthRepository } from '../repositories/health.repository';

const router = Router();
const healthRepository = new InMemoryHealthRepository();
const healthService = new HealthService(healthRepository);
const healthController = new HealthController(healthService);

router.get('/health', healthController.getHealth);

export { router as healthRouter };