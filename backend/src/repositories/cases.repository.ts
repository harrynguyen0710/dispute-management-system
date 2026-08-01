import { loadStore, saveStore } from '../data/store';
import { NotFoundError } from '../errors/NotFoundError';
import type { CaseAuditLog, CaseOutcome, CaseRecord, CaseStatus, EmbeddedStore } from '../models/Case';
import { matchesPartial } from '../utils/stringUtils';

export type CasesSearchQuery =
  | string
  | {
      user_id?: string;
      user_email?: string;
      device_id?: string;
    };

export type CaseAuditLogInput = Omit<CaseAuditLog, 'case_id' | 'log_id'>;
export type CaseOutcomeUpdate = {
  status: CaseStatus;
  outcome: CaseOutcome | null;
  outcome_note: string | null;
  resolved_at: string | null;
};
export type FindOptions = {
  page?: number;
  perPage?: number;
  limit?: number;
  offset?: number;
};


export type CaseWithAuditLogs = {
  caseRecord: CaseRecord;
  auditLogs: CaseAuditLog[];
};

export class CasesRepository {
  constructor(
    private readonly store: EmbeddedStore = loadStore(),
    private readonly persist: (store: EmbeddedStore) => void = saveStore,
  ) {}

  findCases(query?: CasesSearchQuery, opts?: FindOptions): CaseWithAuditLogs[] {
    const records = [...this.store.cases].sort((left, right) =>
      right.created_at.localeCompare(left.created_at),
    );

    let resultRecords: CaseRecord[] = [];

    if (query === undefined || query === '') {
      if (!opts) {
        resultRecords = records;
      } else {
        const { limit, offset, page, perPage } = opts;
        if (limit !== undefined) {
          const start = offset ?? 0;
          resultRecords = records.slice(start, start + limit);
        } else if (page !== undefined || perPage !== undefined || opts.offset !== undefined) {
          const pg = Math.max(1, page ?? 1);
          const pp = perPage ?? 20;
          const start = opts.offset ?? (pg - 1) * pp;
          resultRecords = records.slice(start, start + pp);
        } else {
          resultRecords = records;
        }
      }
    } else {
      let filtered = records;
      if (typeof query === 'string') {
        filtered = records.filter(
          (caseRecord) =>
            matchesPartial(caseRecord.case_id, query) ||
            matchesPartial(caseRecord.user_id, query) ||
            matchesPartial(caseRecord.user_email, query) ||
            matchesPartial(caseRecord.device_id, query),
        );
      } else {
        filtered = records.filter((caseRecord) => {
          const userIdMatches =
            query.user_id === undefined || matchesPartial(caseRecord.user_id, query.user_id);
          const userEmailMatches =
            query.user_email === undefined || matchesPartial(caseRecord.user_email, query.user_email);
          const deviceIdMatches =
            query.device_id === undefined || matchesPartial(caseRecord.device_id, query.device_id);

          return userIdMatches && userEmailMatches && deviceIdMatches;
        });
      }

      if (!opts) {
        resultRecords = filtered;
      } else {
        const { limit, offset, page, perPage } = opts;
        if (limit !== undefined) {
          const start = offset ?? 0;
          resultRecords = filtered.slice(start, start + limit);
        } else if (page !== undefined || perPage !== undefined || opts.offset !== undefined) {
          const pg = Math.max(1, page ?? 1);
          const pp = perPage ?? 20;
          const start = opts.offset ?? (pg - 1) * pp;
          resultRecords = filtered.slice(start, start + pp);
        } else {
          resultRecords = filtered;
        }
      }
    }

    return resultRecords.map((caseRecord) => ({
      caseRecord,
      auditLogs: this.store.case_audit_logs.filter((log) => log.case_id === caseRecord.case_id),
    }));
  }

  findById(caseId: string): CaseRecord | undefined {
    return this.store.cases.find((caseRecord) => caseRecord.case_id === caseId);
  }

  saveOutcome(
    caseId: string,
    update: CaseOutcomeUpdate,
    auditLog?: CaseAuditLogInput,
  ): CaseRecord {
    const caseIndex = this.store.cases.findIndex((caseRecord) => caseRecord.case_id === caseId);

    if (caseIndex < 0) {
      throw new NotFoundError(`Case ${caseId} was not found`);
    }

    const currentCase = this.store.cases[caseIndex]!;
    const updatedCase: CaseRecord = {
      ...currentCase,
      status: update.status,
      outcome: update.outcome,
      outcome_note: update.outcome_note,
      resolved_at: update.resolved_at,
    };

    this.store.cases = this.store.cases.map((caseRecord, index) =>
      index === caseIndex ? updatedCase : caseRecord,
    );

    if (auditLog !== undefined) {
      this.store.case_audit_logs = [
        ...this.store.case_audit_logs,
        {
          ...auditLog,
          case_id: caseId,
          log_id: this.store.next_log_id,
        },
      ];
      this.store.next_log_id += 1;
    }

    this.persist(this.store);
    return updatedCase;
  }
}
