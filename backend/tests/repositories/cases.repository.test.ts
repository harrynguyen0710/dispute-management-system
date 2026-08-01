/// <reference types="node" />

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { CasesRepository } from '../../src/repositories/cases.repository';
import { createCasesStoreFixture } from '../fixtures/cases.fixture';

function createRepository() {
  const store = createCasesStoreFixture();
  return new CasesRepository(store, () => {});
}

describe('CasesRepository', () => {
  it('returns all cases sorted by created_at descending when no query is provided', () => {
    const repository = createRepository();

    const result = repository.findCases();

    assert.deepEqual(result.map(({ caseRecord }) => caseRecord.case_id), [
      'CASE-10003',
      'CASE-10002',
      'CASE-10001',
    ]);
  });

  it('filters by user_id with partial matches', () => {
    const repository = createRepository();

    const result = repository.findCases('usr-1000');

    assert.deepEqual(result.map(({ caseRecord }) => caseRecord.case_id), ['CASE-10002', 'CASE-10001']);
  });

  it('filters by email case-insensitively and by partial substrings', () => {
    const repository = createRepository();

    const result = repository.findCases('Dakota');

    assert.deepEqual(result.map(({ caseRecord }) => caseRecord.case_id), ['CASE-10002']);
  });

  it('filters by device_id with partial matches', () => {
    const repository = createRepository();

    const result = repository.findCases('8bab');

    assert.deepEqual(result.map(({ caseRecord }) => caseRecord.case_id), ['CASE-10002']);
  });

  it('returns an empty array when no matches are found', () => {
    const repository = createRepository();

    const result = repository.findCases('does-not-match');

    assert.deepEqual(result, []);
  });

  it('finds a case by id', () => {
    const repository = createRepository();

    const result = repository.findById('CASE-10002');

    assert.equal(result?.case_id, 'CASE-10002');
    assert.equal(result?.user_email, 'dakota.nguyen10@inbox.test');
  });

  it('returns undefined for an unknown case id', () => {
    const repository = createRepository();

    const result = repository.findById('CASE-99999');

    assert.equal(result, undefined);
  });

  it('updates the target case without mutating other cases', () => {
    const repository = createRepository();
    const storeBefore = createCasesStoreFixture();

    const updated = repository.saveOutcome('CASE-10001', {
      status: 'resolved',
      outcome: 'fraud_confirmed',
      outcome_note: 'Manual review completed.',
      resolved_at: '2026-07-21T12:00:00Z',
    });

    assert.equal(updated.status, 'resolved');
    assert.equal(updated.outcome, 'fraud_confirmed');
    assert.equal(updated.outcome_note, 'Manual review completed.');
    assert.equal(updated.resolved_at, '2026-07-21T12:00:00Z');

    const untouchedCase = repository.findById('CASE-10002');
    assert.deepEqual(untouchedCase, storeBefore.cases[1]);
  });

  it('leaves audit logs unchanged when no audit log is provided', () => {
    const store = createCasesStoreFixture();
    const repository = new CasesRepository(store, () => {});

    const before = store.case_audit_logs.length;
    const updated = repository.saveOutcome('CASE-10003', {
      status: 'resolved',
      outcome: 'lost',
      outcome_note: 'Customer reversed the chargeback.',
      resolved_at: '2026-07-22T12:00:00Z',
    });

    assert.equal(updated.case_id, 'CASE-10003');
    assert.equal(before, 1);
    assert.equal(store.case_audit_logs.length, before);
    assert.equal(repository.findById('CASE-10003')?.status, 'resolved');
  });

  it('appends an audit log and increments next_log_id when one is provided', () => {
    const store = createCasesStoreFixture();
    const repository = new CasesRepository(store, () => {});

    const updated = repository.saveOutcome(
      'CASE-10002',
      {
        status: 'resolved',
        outcome: 'fraud_confirmed',
        outcome_note: 'Corrected after appeal.',
        resolved_at: '2026-07-23T09:00:00Z',
      },
      {
        previous_outcome: 'won',
        new_outcome: 'fraud_confirmed',
        correction_reason: 'appeal_review',
        changed_at: '2026-07-23T09:00:00Z',
      },
    );

    assert.equal(updated.outcome, 'fraud_confirmed');
    assert.equal(store.case_audit_logs.length, 2);
    assert.equal(store.case_audit_logs[1]?.log_id, 2);
    assert.equal(store.case_audit_logs[1]?.case_id, 'CASE-10002');
    assert.equal(store.next_log_id, 3);
  });
});
