import { ApiMiddlewareBag, ApiError } from '../types';

export default (error: ApiError, { reject, errors, config }: ApiMiddlewareBag): void => {
  console.log('REJECT', error);
  if (!error.response || error.code === '502' || error.code === '504') {
    const attempts = errors.length;
    // Stop trying if attempts exceed max allowed attempts
    if (attempts >= config.maxErrorAttempts) {
      if (error.response) {
        reject(error);
      } else {
        reject('network_error');
      }
    }
  } else {
    console.log('REJECTED');
    reject(error);
  }
};
