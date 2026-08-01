import 'dotenv/config';
import { createApp } from './app';
import { getPort } from './config/env';
import { logger } from './logging/logger';

const port = getPort();
const app = createApp();

app.listen(port, () => {
  logger.info({ port }, 'API listening');
});