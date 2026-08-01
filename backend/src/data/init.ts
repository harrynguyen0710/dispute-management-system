import { ensureStoreFile, resolveStorePath } from './store';
import { logger } from '../logging/logger';

try {
  ensureStoreFile();
  logger.info({ path: resolveStorePath() }, 'Embedded data store initialized');
} catch (error) {
  logger.error({ err: error }, 'Failed to initialize embedded data store');
  process.exitCode = 1;
}
