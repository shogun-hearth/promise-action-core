export type DefaultConfig = {
  interval: number;
}

export type MiddlewareBag<C extends DefaultConfig, R, E, RE> = {
  responses: R[];
  errors: E[];
  resolve: (response: R) => void;
  reject: (error: RE) => void;
  config: C;
}

export type ResponseMiddleware<C extends DefaultConfig, R, E, RE> =
  (response: R, bag: MiddlewareBag<C, R, E, RE>) => void;

export type ErrorMiddleware<C extends DefaultConfig, R, E, RE> =
  (error: E, bag: MiddlewareBag<C, R, E, RE>) => void;

