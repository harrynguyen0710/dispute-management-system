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
      const userId = normalizeQueryValue(request.query.user_id ?? request.query.userId);
      const deviceId = normalizeQueryValue(request.query.device_id ?? request.query.deviceId);
      const userEmail = normalizeQueryValue(request.query.user_email ?? request.query.userEmail);

      const page = normalizePositiveInteger(request.query.page) ?? 1;
      const pageSize = normalizePositiveInteger(
        request.query.pageSize ?? request.query.page_size ?? request.query.perPage,
      ) ?? 20;

      let query: string | { user_id?: string; user_email?: string; device_id?: string } | undefined = undefined;

      if (userId || deviceId || userEmail) {
        const q: { user_id?: string; user_email?: string; device_id?: string } = {};
        if (userId) q.user_id = userId;
        if (userEmail) q.user_email = userEmail;
        if (deviceId) q.device_id = deviceId;
        query = q;
      } else {
        query = search;
      }

      const data = this.casesService.listCases(query, {
        page,
        pageSize,
      });

      response.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  getTrends = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const data = this.casesService.getTrends();
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