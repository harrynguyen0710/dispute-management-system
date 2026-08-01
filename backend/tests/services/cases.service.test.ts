/// <reference types="node" />

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { CasesService } from '../../src/services/cases.service';
import { NotFoundError } from '../../src/errors/NotFoundError';
import { ValidationError } from '../../src/errors/ValidationError';
import { CasesRepository } from '../../src/repositories/cases.repository';
import { createCasesStoreFixture } from '../fixtures/cases.fixture';

function createService() {
  const store = createCasesStoreFixture();
  const repository = new CasesRepository(store, () => {});

  return { repository, service: new CasesService(repository), store };
}

describe('CasesService', () => {
  it('returns paginated masked cases', () => {
    const { service } = createService();

    const result = service.listCases(undefined, { page: 1, pageSize: 2 });

    assert.equal(result.pagination.page, 1);
    assert.equal(result.pagination.pageSize, 2);
    assert.equal(result.pagination.total, 3);
    assert.equal(result.pagination.totalPages, 2);
    assert.deepEqual(result.data.map((caseRecord) => caseRecord.case_id), [
      'CASE-10003',
      'CASE-10002',
    ]);
    assert.equal(result.data[0]?.user_email, 'b***@example.test');
    assert.equal(result.data[0]?.device_id, 'dev-20***');
    assert.equal(result.data[1]?.user_email, 'd***@inbox.test');
    assert.equal(result.data[1]?.device_id, 'dev-8b***');
  });

  it('searches cases before applying pagination', () => {
    const { service } = createService();

    const result = service.listCases('Dakota', { page: 1, pageSize: 5 });

    assert.equal(result.pagination.total, 1);
    assert.equal(result.pagination.totalPages, 1);
    assert.deepEqual(result.data.map((caseRecord) => caseRecord.case_id), ['CASE-10002']);
  });

  it('resolves an open case', () => {
    const { service, repository, store } = createService();

    const result = service.updateOutcome('CASE-10001', {
      outcome: 'fraud_confirmed',
      outcome_note: 'Manual review completed.',
    });

    const updatedCase = repository.findById('CASE-10001');

    assert.deepEqual(result, {
      success: true,
      message: 'Case outcome updated',
      is_correction: false,
    });
    assert.equal(updatedCase?.status, 'resolved');
    assert.equal(updatedCase?.outcome, 'fraud_confirmed');
    assert.equal(updatedCase?.outcome_note, 'Manual review completed.');
    assert.match(updatedCase?.resolved_at ?? '', /^\d{4}-\d{2}-\d{2}T/);

    assert.equal(store.case_audit_logs.length, 2);
    assert.equal(store.case_audit_logs[1]?.case_id, 'CASE-10001');
    assert.equal(store.case_audit_logs[1]?.previous_outcome, null);
    assert.equal(store.case_audit_logs[1]?.new_outcome, 'fraud_confirmed');
  });

  it('records a correction without changing resolved_at', () => {
    const { service, repository, store } = createService();

    const result = service.updateOutcome('CASE-10002', {
      outcome: 'fraud_confirmed',
      correction_reason: 'appeal_review',
    });

    const updatedCase = repository.findById('CASE-10002');

    assert.deepEqual(result, {
      success: true,
      message: 'Case outcome corrected',
      is_correction: true,
    });
    assert.equal(updatedCase?.resolved_at, '2026-07-12T10:00:00Z');
    assert.equal(store.case_audit_logs.length, 2);
    assert.equal(store.case_audit_logs[1]?.case_id, 'CASE-10002');
    assert.equal(store.case_audit_logs[1]?.previous_outcome, 'won');
    assert.equal(store.case_audit_logs[1]?.new_outcome, 'fraud_confirmed');
    assert.equal(store.case_audit_logs[1]?.correction_reason, 'appeal_review');
    assert.equal(updatedCase?.outcome_note, 'Reviewed and confirmed.');
  });

  it('requires a correction reason for resolved cases', () => {
    const { service } = createService();

    assert.throws(
      () =>
        service.updateOutcome('CASE-10002', {
          outcome: 'lost',
        }),
      ValidationError,
    );
  });

  it('throws when a case cannot be found', () => {
    const { service } = createService();

    assert.throws(
      () =>
        service.updateOutcome('CASE-99999', {
          outcome: 'won',
        }),
      NotFoundError,
    );
  });
});