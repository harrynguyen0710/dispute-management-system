import { Router } from 'express';
import { CasesController } from '../controllers/cases.controller';
import { CasesRepository } from '../repositories/cases.repository';
import { CasesService } from '../services/cases.service';

export function createCasesRouter(casesController?: CasesController) {
  const router = Router();
  const repository = new CasesRepository();
  const service = new CasesService(repository);
  const controller = casesController ?? new CasesController(service);

  router.get('/', controller.getCases);
  router.get('/trends', controller.getTrends);
  router.patch('/:case_id/outcome', controller.updateCaseOutcome);

  return router;
}

export const casesRouter = createCasesRouter();