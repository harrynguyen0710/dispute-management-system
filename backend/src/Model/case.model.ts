export type CaseStatus = 'open' | 'resolved';
export type CaseOutcome = 'won' | 'lost' | 'fraud_confirmed';

export type CaseRecord = {
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
};

export type CaseAuditLog = {
  log_id: number;
  case_id: string;
  previous_outcome: CaseOutcome | null;
  new_outcome: CaseOutcome | null;
  correction_reason: string | null;
  changed_at: string;
};

export type EmbeddedStore = {
  cases: CaseRecord[];
  case_audit_logs: CaseAuditLog[];
  next_log_id: number;
};