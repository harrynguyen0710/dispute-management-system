import type { CaseAuditLog, CaseRecord, CaseOutcome, CaseStatus } from '../models/Case';

export interface UpdateOutcomeRequestDto {
  status: CaseStatus;
  outcome: CaseOutcome | null;
  outcome_note: string | null;
  resolved_at: string | null;
}

export interface CaseResponseDto extends CaseRecord {
  case_audit_logs: CaseAuditLog[];
}
