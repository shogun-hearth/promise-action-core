import { ApiMiddlewareBag, ApiError } from '../types';
import { ApiNetworkError } from '../errors';

export default (error: ApiError, { reject, errors, config }: ApiMiddlewareBag): void => {
  if (!error.response || error.code === '502' || error.code === '504') {
    const attempts = errors.length;
    // Stop trying if attempts exceed max allowed attempts
    if (attempts >= config.maxErrorAttempts) {
      if (error.response) {
        reject(error);
      } else {
        reject(new ApiNetworkError());
      }
    }
  } else {
    reject(error);
  }
};
