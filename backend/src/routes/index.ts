import { Router } from 'express';
import { healthRouter } from './health.routes';

export function createRoutes() {
  const router = Router();

  router.use(healthRouter);

  return router;
}