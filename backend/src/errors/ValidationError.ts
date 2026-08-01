import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', code = 'VALIDATION_ERROR') {
    super(400, message, code);
    this.name = 'ValidationError';
  }
}
