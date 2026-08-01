import fs from 'node:fs';
import path from 'node:path';

import { getDataStorePath } from '../config/env';
import type { EmbeddedStore } from '../models/Case';

const DEFAULT_STORE: EmbeddedStore = {
  cases: [],
  case_audit_logs: [],
  next_log_id: 1,
};

export function resolveStorePath() {
  const configuredPath = getDataStorePath();
  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(process.cwd(), configuredPath);
}

export function loadStore(): EmbeddedStore {
  const filePath = resolveStorePath();

  if (!fs.existsSync(filePath)) {
    return { ...DEFAULT_STORE };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(content) as Partial<EmbeddedStore>;

  return {
    cases: parsed.cases ?? [],
    case_audit_logs: parsed.case_audit_logs ?? [],
    next_log_id: parsed.next_log_id ?? 1,
  };
}

export function saveStore(store: EmbeddedStore) {
  const filePath = resolveStorePath();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
}

export function ensureStoreFile() {
  const store = loadStore();
  saveStore(store);
}
