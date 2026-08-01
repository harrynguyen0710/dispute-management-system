import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../logging/logger';

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    logger.warn({ error, path: request.path }, error.message);
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message
      }
    });
    return;
  }

  logger.error({ error, path: request.path }, 'Unhandled application error');
  response.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}