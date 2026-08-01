import { ValidationError } from '../errors/ValidationError';
import type { CaseOutcome } from '../models/Case';

export function normalizeQueryValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    const trimmed = value[0].trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  return undefined;
}

export function normalizePositiveInteger(value: unknown): number | undefined {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (rawValue === undefined) {
    return undefined;
  }

  const parsed = typeof rawValue === 'string' ? Number.parseInt(rawValue, 10) : Number(rawValue);

  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 1) {
    throw new ValidationError('Pagination parameters must be positive integers');
  }

  return parsed;
}

export function isCaseOutcome(value: unknown): value is CaseOutcome {
  return value === 'won' || value === 'lost' || value === 'fraud_confirmed';
}
