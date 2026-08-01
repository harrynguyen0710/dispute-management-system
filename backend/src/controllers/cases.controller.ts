import type { NextFunction, Request, Response } from 'express';
import type { UpdateOutcomeRequestDto } from '../dtos/cases.dto';
import { ValidationError } from '../errors/ValidationError';
import type { CasesService } from '../services/cases.service';
import { normalizePositiveInteger, normalizeQueryValue } from '../utils/validationUtils';


export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  getCases = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const search = normalizeQueryValue(request.query.search);
      const page = normalizePositiveInteger(request.query.page) ?? 1;
      const pageSize = normalizePositiveInteger(
        request.query.pageSize ?? request.query.page_size ?? request.query.perPage,
      ) ?? 20;

      const data = this.casesService.listCases(search, {
        page,
        pageSize,
      });

      response.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  updateCaseOutcome = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const caseId = request.params.case_id;
      const payload = request.body as Partial<UpdateOutcomeRequestDto>;

      if (typeof caseId !== 'string' || caseId.trim().length === 0) {
        throw new ValidationError('Case id is required');
      }

      if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new ValidationError('Request body must be an object');
      }

      if (typeof payload.outcome !== 'string') {
        throw new ValidationError('Outcome is required');
      }

      const data = this.casesService.updateOutcome(caseId, payload as UpdateOutcomeRequestDto);

      response.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}