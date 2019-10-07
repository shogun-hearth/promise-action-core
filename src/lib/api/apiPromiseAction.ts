import promiseActionCreator from '../promiseActionCreator';
import { Config, ApiResponse, ApiError, ApiRejectionError } from './types';
import pollMiddleware from './middlewares/pollMiddleware';
import errorMiddleware from './middlewares/errorMiddleware';
import successMiddleware from './middlewares/successMiddleware';

export default
  promiseActionCreator.configure<Config, ApiResponse, ApiError, ApiRejectionError>({
    config: {
      maxPollAttempts: 120,
      maxErrorAttempts: 2,
    },
    responseMiddlewares: [
      pollMiddleware,
      successMiddleware,
    ],
    errorMiddlewares: [
      errorMiddleware,
    ],
  });
