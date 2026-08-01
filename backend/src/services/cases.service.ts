import type {
  CaseListResponseDto,
  CaseResponseDto,
  UpdateOutcomeRequestDto,
  UpdateOutcomeResponseDto,
} from '../dtos/cases.dto';
import { NotFoundError } from '../errors/NotFoundError';
import { ValidationError } from '../errors/ValidationError';
import type { CaseAuditLog, CaseOutcome, CaseRecord } from '../models/Case';
import type { CasesRepository } from '../repositories/cases.repository';
import { maskDeviceId, maskEmailAddress, normalizeOptionalText } from '../utils/stringUtils';
import { isCaseOutcome } from '../utils/validationUtils';

export type CasesListPagination = {
  page: number;
  pageSize: number;
};


function toCaseResponseDto(caseRecord: CaseRecord): CaseResponseDto {
  return {
    case_id: caseRecord.case_id,
    user_id: caseRecord.user_id,
    user_email: maskEmailAddress(caseRecord.user_email),
    device_id: maskDeviceId(caseRecord.device_id),
    amount: caseRecord.amount,
    currency: caseRecord.currency,
    created_at: caseRecord.created_at,
    region: caseRecord.region,
    status: caseRecord.status,
    outcome: caseRecord.outcome,
    outcome_note: caseRecord.outcome_note,
    resolved_at: caseRecord.resolved_at,
  };
}

function toCorrectionNote(originalNote: string | null, correctedAt: string, reason: string): string {
  if (originalNote === null) {
    return `[Corrected ${correctedAt.slice(0, 10)}]: ${reason}`;
  }

  return `${originalNote} | [Corrected ${correctedAt.slice(0, 10)}]: ${reason}`;
}

export class CasesService {
  constructor(private readonly casesRepository: CasesRepository) {}

  listCases(searchQuery?: string, pagination?: CasesListPagination): CaseListResponseDto {
    const normalizedSearchQuery = searchQuery?.trim().length ? searchQuery.trim() : undefined;
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;

    if (!Number.isInteger(page) || page < 1) {
      throw new ValidationError('Page must be a positive integer');
    }

    if (!Number.isInteger(pageSize) || pageSize < 1) {
      throw new ValidationError('Page size must be a positive integer');
    }

    const total = this.casesRepository.findCases(normalizedSearchQuery).length;
    const records = this.casesRepository.findCases(normalizedSearchQuery, {
      page,
      perPage: pageSize,
    });

    return {
      data: records.map(toCaseResponseDto),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
      },
    };
  }

  updateOutcome(caseId: string, payload: UpdateOutcomeRequestDto): UpdateOutcomeResponseDto {
    const currentCase = this.casesRepository.findById(caseId);

    if (!currentCase) {
      throw new NotFoundError(`Case ${caseId} was not found`);
    }

    if (!isCaseOutcome(payload.outcome)) {
      throw new ValidationError('Outcome is required');
    }

    const resolvedAt = new Date().toISOString();
    const nextOutcomeNote = normalizeOptionalText(payload.outcome_note);
    const isCorrection = currentCase.status === 'resolved';

    if (isCorrection) {
      const correctionReason = normalizeOptionalText(payload.correction_reason);

      if (!correctionReason) {
        throw new ValidationError('Correction reason is required');
      }

      const correctedOutcomeNote = toCorrectionNote(
        nextOutcomeNote ?? currentCase.outcome_note,
        resolvedAt,
        correctionReason,
      );

      const auditLog: Omit<CaseAuditLog, 'case_id' | 'log_id'> = {
        previous_outcome: currentCase.outcome,
        new_outcome: payload.outcome,
        correction_reason: correctionReason,
        changed_at: resolvedAt,
      };

      this.casesRepository.saveOutcome(
        caseId,
        {
          status: 'resolved',
          outcome: payload.outcome,
          outcome_note: correctedOutcomeNote,
          resolved_at: currentCase.resolved_at,
        },
        auditLog,
      );

      return {
        success: true,
        message: 'Case outcome corrected',
        is_correction: true,
      };
    }

    this.casesRepository.saveOutcome(caseId, {
      status: 'resolved',
      outcome: payload.outcome,
      outcome_note: nextOutcomeNote,
      resolved_at: resolvedAt,
    });

    return {
      success: true,
      message: 'Case outcome updated',
      is_correction: false,
    };
  }
}