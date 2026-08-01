import type { EmbeddedStore } from '../../src/models/Case';

export function createCasesStoreFixture(): EmbeddedStore {
  return {
    cases: [
      {
        case_id: 'CASE-10001',
        user_id: 'usr-10001',
        user_email: 'alpha.one@example.test',
        device_id: 'dev-10001aaa',
        amount: 12.34,
        currency: 'USD',
        created_at: '2026-07-01T10:00:00Z',
        region: 'NA-US',
        status: 'open',
        outcome: null,
        outcome_note: null,
        resolved_at: null,
      },
      {
        case_id: 'CASE-10002',
        user_id: 'usr-10002',
        user_email: 'dakota.nguyen10@inbox.test',
        device_id: 'dev-8babce3b',
        amount: 98.76,
        currency: 'EUR',
        created_at: '2026-07-12T10:00:00Z',
        region: 'EU-FR',
        status: 'resolved',
        outcome: 'won',
        outcome_note: 'Reviewed and confirmed.',
        resolved_at: '2026-07-12T10:00:00Z',
      },
      {
        case_id: 'CASE-10003',
        user_id: 'usr-20003',
        user_email: 'beta.two@example.test',
        device_id: 'dev-20003bbb',
        amount: 44.5,
        currency: 'GBP',
        created_at: '2026-07-20T10:00:00Z',
        region: 'EU-GB',
        status: 'open',
        outcome: null,
        outcome_note: null,
        resolved_at: null,
      },
    ],
    case_audit_logs: [
      {
        log_id: 1,
        case_id: 'CASE-10002',
        previous_outcome: null,
        new_outcome: 'won',
        correction_reason: 'seed_import',
        changed_at: '2026-07-12T10:00:00Z',
      },
    ],
    next_log_id: 2,
  };
}

export const casesStoreFixture = createCasesStoreFixture();
