export function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

export function matchesPartial(value: string, query: string) {
  return normalizeValue(value).includes(normalizeValue(query));
}
