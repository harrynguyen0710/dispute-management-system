import fs from 'node:fs';
import path from 'node:path';

import { type CaseOutcome, type CaseStatus } from '../Model';
import { logger } from '../logging/logger';
import { loadStore, saveStore } from './store';

type CaseCsvRow = {
  case_id: string;
  user_id: string;
  user_email: string;
  device_id: string;
  amount: string;
  currency: string;
  created_at: string;
  region: string;
  status: string;
  outcome: string;
  outcome_note: string;
};

const VALID_STATUS = new Set<CaseStatus>(['open', 'resolved']);
const VALID_OUTCOME = new Set<CaseOutcome>(['won', 'lost', 'fraud_confirmed']);

function getCsvPath() {
  return path.resolve(process.cwd(), 'seed_data/case_data.csv');
}

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const nextChar = line[i + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
        continue;
      }

      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function readCsvRows() {
  const csvPath = getCsvPath();
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return [] as CaseCsvRow[];
  }

  const headers = parseCsvLine(lines[0] ?? '');

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = Object.fromEntries(
      headers.map((header, index) => [header, values[index] ?? '']),
    ) as CaseCsvRow;

    return row;
  });
}

function normalizeOutcome(value: string): CaseOutcome | null {
  if (!value) {
    return null;
  }

  return VALID_OUTCOME.has(value as CaseOutcome) ? (value as CaseOutcome) : null;
}

function parseAmount(rawAmount: string): number | null {
  const amount = Number(rawAmount);
  return Number.isFinite(amount) ? amount : null;
}

try {
  const store = loadStore();
  const rows = readCsvRows();

  const existingCaseIds = new Set(store.cases.map((item) => item.case_id));
  const existingAuditKeys = new Set(
    store.case_audit_logs.map(
      (item) =>
        `${item.case_id}|${item.previous_outcome ?? ''}|${item.new_outcome ?? ''}|${item.correction_reason ?? ''}|${item.changed_at}`,
    ),
  );

  let insertedCases = 0;
  let insertedAudits = 0;
  let skippedRows = 0;
  let duplicateCases = 0;

  for (const row of rows) {
    const status = row.status as CaseStatus;
    const amount = parseAmount(row.amount);
    const outcome = normalizeOutcome(row.outcome);
    const hasOutcomeText = row.outcome.length > 0;

    if (!VALID_STATUS.has(status) || amount === null) {
      skippedRows += 1;
      continue;
    }

    if (hasOutcomeText && !outcome) {
      skippedRows += 1;
      continue;
    }

    if ((status === 'open' && outcome) || (status === 'resolved' && !outcome)) {
      skippedRows += 1;
      continue;
    }

    if (existingCaseIds.has(row.case_id)) {
      duplicateCases += 1;
      continue;
    }

    const resolvedAt = status === 'resolved' ? row.created_at : null;

    store.cases.push({
      case_id: row.case_id,
      user_id: row.user_id,
      user_email: row.user_email,
      device_id: row.device_id,
      amount,
      currency: row.currency,
      created_at: row.created_at,
      region: row.region,
      status,
      outcome,
      outcome_note: row.outcome_note || null,
      resolved_at: resolvedAt,
    });

    existingCaseIds.add(row.case_id);
    insertedCases += 1;

    if (outcome) {
      const auditKey = `${row.case_id}||${outcome}|seed_import|${row.created_at}`;
      if (!existingAuditKeys.has(auditKey)) {
        store.case_audit_logs.push({
          log_id: store.next_log_id,
          case_id: row.case_id,
          previous_outcome: null,
          new_outcome: outcome,
          correction_reason: 'seed_import',
          changed_at: row.created_at,
        });
        store.next_log_id += 1;
        existingAuditKeys.add(auditKey);
        insertedAudits += 1;
      }
    }
  }

  saveStore(store);

  logger.info(
    { insertedCases, insertedAudits, skippedRows, duplicateCases },
    'Embedded store seed complete',
  );
} catch (error) {
  logger.error({ err: error }, 'Embedded store seed failed');
  process.exitCode = 1;
}
