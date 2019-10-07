import PromiseAction from './promiseAction';
import { DefaultConfig, ResponseMiddleware, ErrorMiddleware, MiddlewareBag } from './types';

const DEFAULT_OPTIONS: DefaultConfig = {
  interval: 500,
};

function timeout(ms: number): Promise<unknown> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class PromiseActionCreator<
  Config extends DefaultConfig,
  Response,
  Error,
  RejectionError = Error
> {
  config: Config;
  responseMiddlewares: ResponseMiddleware<Config, Response, Error, RejectionError>[] = [];
  errorMiddlewares: ErrorMiddleware<Config, Response, Error, RejectionError>[] = [];

  constructor({
    config,
    responseMiddlewares,
    errorMiddlewares,
  }: {
    config: Partial<Config>,
    responseMiddlewares: ResponseMiddleware<Config, Response, Error, RejectionError>[],
    errorMiddlewares: ErrorMiddleware<Config, Response, Error, RejectionError>[],
  }) {
    this.config = { ...DEFAULT_OPTIONS, ...config } as Config;
    this.responseMiddlewares = responseMiddlewares;
    this.errorMiddlewares = errorMiddlewares;
  }

  create<Args, R extends Response>(action: (args: Args) => Promise<R>): PromiseAction<Args, R, RejectionError> {
    return new PromiseAction(
      (args: Args) => new Promise(
        async (
          resolve: (r: R) => void,
          reject: (e: RejectionError) => void,
        ) => {
          let responses: R[] = [];
          let errors: Error[] = [];

          const bag: MiddlewareBag<Config, Response, Error, RejectionError> = {
            responses,
            errors,
            config: this.config,
            resolve: resolve as (r: Response) => void,
            reject,
          };

          while(true) {
            try {
              const response = await action(args);
              responses.push(response);
      
              this.responseMiddlewares.forEach(middleware => {
                middleware(response, bag);
              });
            } catch (e) {
              const error: Error = e;
              errors.push(error);
      
              this.errorMiddlewares.forEach(middleware => {
                middleware(error, bag);
              });
            }

            await timeout(this.config.interval);
          }
        })
    );
  }
}

export default {
  configure: <C extends DefaultConfig, R, E, NE>(args: {
    config: Partial<C>,
    responseMiddlewares: ResponseMiddleware<C, R, E, NE>[],
    errorMiddlewares: ErrorMiddleware<C, R, E, NE>[],
  }): PromiseActionCreator<C, R, E, NE> => new PromiseActionCreator(args),
};
