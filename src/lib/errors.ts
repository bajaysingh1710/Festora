export class AppError extends Error {
  constructor(message: string, public statusCode: number = 500, public code: string = 'APP_ERROR') {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: Record<string, string>) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class PassValidationError extends AppError {
  constructor(message: string, public passStatus: 'already_checked_in' | 'cancelled' | 'invalid') {
    super(message, 422, 'PASS_VALIDATION_ERROR');
  }
}

export class BudgetError extends AppError {
  constructor(message: string, public overrunAmount?: number) {
    super(message, 400, 'BUDGET_CALCULATION_ERROR');
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError;
