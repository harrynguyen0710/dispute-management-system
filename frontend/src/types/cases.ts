export type CaseStatus = 'open' | 'resolved';
export type CaseOutcome = 'won' | 'lost' | 'fraud_confirmed' | '';

export interface UpdateOutcomeRequestDto {
  outcome: CaseOutcome;
  outcome_note?: string;
  correction_reason?: string;
}

export interface UpdateOutcomeResponseDto {
  success: boolean;
  message: string;
  is_correction: boolean;
}

export interface CaseAuditLog {
  log_id: number;
  case_id: string;
  previous_outcome: CaseOutcome | null;
  new_outcome: CaseOutcome | null;
  correction_reason: string | null;
  changed_at: string;
}

export interface CaseResponseDto {
  case_id: string;
  user_id: string;
  user_email: string;
  device_id: string;
  amount: number;
  currency: string;
  created_at: string;
  region: string;
  status: CaseStatus;
  outcome: CaseOutcome | null;
  outcome_note: string | null;
  resolved_at: string | null;
  audit_logs: CaseAuditLog[];
}

export interface CaseListPaginationDto {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CaseListResponseDto {
  data: CaseResponseDto[];
  pagination: CaseListPaginationDto;
}

