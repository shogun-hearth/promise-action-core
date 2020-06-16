import { CustomError } from 'ts-custom-error';

export class ApiMaxPollError extends CustomError {
  constructor() {
    super("Polling limit exceeded");
  }
}

export class ApiNetworkError extends CustomError {
  constructor() {
    super("Network error");
  }
}
