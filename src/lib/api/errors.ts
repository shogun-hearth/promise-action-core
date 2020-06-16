import { CustomError } from 'ts-custom-error';

export class ApiMaxPollError extends CustomError {
  constructor() {
    super("Polling limit exceeded");
    Object.defineProperty(this, 'name', { value: 'ApiMaxPollError' });
  }
}

export class ApiNetworkError extends CustomError {
  constructor() {
    super("Network error");
    Object.defineProperty(this, 'name', { value: 'ApiNetworkError' });
  }
}
