type PromiseDispatchAction<P extends string, S extends string, E extends string, Response, Error> =
  { type: P; } |
  { type: S; payload: Response; } |
  { type: E; payload: Error; };

export type Dispatcher<Args = any, P extends string = string, S extends string = string, E extends string = string, Response = any, Error = any> =
  (args: Args) =>
    (dispatch: (action: PromiseDispatchAction<P, S, E, Response, Error>) => void) =>
      Promise<Response>;

export type DispatchAction<T extends Dispatcher> = Parameters<Parameters<ReturnType<T>>[0]>[0];

class PromiseAction<Args extends {}, Response, Error> {
  action: (args: Args) => Promise<Response>;
  responseListeners: ((response: Response) => void)[];
  errorListeners: ((error: Error) => void)[];

  constructor(
    action: (args: Args) => Promise<Response>,
    responseListeners: ((response: Response) => void)[] = [],
    errorListeners: ((error: Error) => void)[] = [],
  ) {
    this.action = action;
    this.responseListeners = responseListeners;
    this.errorListeners = errorListeners;
  }

  async run(args: Args): Promise<Response> {
    try {
      const response = await this.action(args);
      this.responseListeners.forEach(listener => listener(response));
      return response;
    } catch (e) {
      const error: Error = e;
      this.errorListeners.forEach(listener => listener(error));
      throw e;
    }
  }

  normalizeResponse<NormalizedResponse>(normalizer: (response: Response) => NormalizedResponse): PromiseAction<Args, NormalizedResponse, Error> {
    return new PromiseAction<Args, NormalizedResponse, Error>(
      (args: Args) => this.action(args).then(normalizer)
    );
  }

  normalizeError<NormalizedError>(normalizer: (error: Error) => NormalizedError): PromiseAction<Args, Response, NormalizedError> {
    return new PromiseAction<Args, Response, NormalizedError>(
      (args: Args) => this.action(args).catch(e => { throw normalizer(e); })
    );
  }

  interceptResponse(listener: (response: Response) => void): PromiseAction<Args, Response, Error> {
    return new PromiseAction(
      this.action,
      [...this.responseListeners, listener],
      [...this.errorListeners],
    );
  }

  interceptError(listener: (error: Error) => void): PromiseAction<Args, Response, Error> {
    return new PromiseAction(
      this.action,
      [...this.responseListeners],
      [...this.errorListeners, listener],
    );
  }

  dispatcher<State, T extends keyof Args, P extends string = string, S extends string = string, E extends string = string>
    (
      pendingType: P,
      successType: S,
      errorType: E,
      partialArgsOrFuncs: { [key in T]?: ((state: State) => Args[key]) | Args[key]; } = {}
    ) : Dispatcher<Omit<Args, T>, P, S, E, Response, Error> {
    return (args: Omit<Args, T>) =>
      async (
        dispatch: (args: PromiseDispatchAction<P, S, E, Response, Error>) => void,
        getState: () => State = () => ({} as State),
      ) => {
        dispatch({ type: pendingType });
        try {
          const state = getState();
          const partialArgs: Pick<Args, T> = Object.entries(partialArgsOrFuncs)
            .reduce((accumulator, [key, value]) => ({
              ...accumulator,
              [key]: value instanceof Function ? value(state) : value,
            }), {}) as Pick<Args, T>;

          const response = await this.run({ ...args, ...partialArgs } as Args);
          dispatch({
            type: successType,
            payload: response,
          });
          return response;
        } catch (e) {
          dispatch({
            type: errorType,
            payload: e,
          });
          throw e;
        }
      }
  }
}

export default PromiseAction;
