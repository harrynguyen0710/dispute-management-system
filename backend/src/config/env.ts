export function getPort() {
  return Number(process.env.PORT ?? 4000);
}