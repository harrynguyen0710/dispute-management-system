import { Router } from 'express';
import { casesRouter } from './cases.routes';
import { healthRouter } from './health.routes';

export function createRoutes() {
  const router = Router();

  router.use('/api/cases', casesRouter);
  router.use(healthRouter);

  return router;
}