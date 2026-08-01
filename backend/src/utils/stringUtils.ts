export function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

export function matchesPartial(value: string, query: string) {
  return normalizeValue(value).includes(normalizeValue(query));
}

export function normalizeOptionalText(value?: string | null): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function maskEmailAddress(email: string): string {
  const [localPart = '', domain = ''] = email.split('@');

  if (domain.length === 0) {
    return `${localPart.slice(0, 1)}***`;
  }

  return `${localPart.slice(0, 1)}***@${domain}`;
}

export function maskDeviceId(deviceId: string): string {
  return `${deviceId.slice(0, 6)}***`;
}

