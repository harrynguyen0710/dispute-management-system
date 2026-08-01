export function getPort() {
  return Number(process.env.PORT ?? 4000);
}

export function getDataStorePath() {
  return process.env.DATA_STORE_PATH ?? 'data/cases-store.json';
}