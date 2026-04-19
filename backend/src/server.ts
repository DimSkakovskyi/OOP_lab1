import 'reflect-metadata';
import { AppDataSource } from './config/data-source';
import { env } from './config/env';
import { logger } from './config/logger';
import app from './app';

AppDataSource.initialize()
  .then(() => {
    logger.info('Database connected');

    app.listen(env.port, () => {
      logger.info(`Backend API running on port ${env.port}`);
    });
  })
  .catch((error) => {
    logger.error(`Database connection failed: ${String(error)}`);
  });