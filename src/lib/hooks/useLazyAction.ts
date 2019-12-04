import { useReducer } from 'react';
import PromiseAction, { DispatchAction } from '../promiseAction';

export type State<Data, Error> = {
  loading: boolean;
  successful?: boolean;
  data?: Data;
  error?: Error; 
}

type Result<Data, Error, Args> = State<Data, Error> & {
  run: (args: Args) => Promise<Data>;
};

export type Options = {
  resetOnReload: boolean;
  initialLoading: boolean;
}

const DEFAULT_OPTIONS: Options = {
  resetOnReload: false,
  initialLoading: false,
}

export default <Args, Data, Error, PartialArgs extends keyof Args>(
  promiseAction: PromiseAction<Args, Data, Error>,
  partialArgs: { [key in PartialArgs]?: Args[key]; } = {},
  partialOpts: Partial<Options> = {},
): Result<Data, Error, Omit<Args, PartialArgs>> => {
  const opts: Options = {
    ...DEFAULT_OPTIONS,
    ...partialOpts,
  };
  const dispatcher = promiseAction.dispatcher(
    'PENDING',
    'SUCCESS',
    'ERROR',
    partialArgs
  );

  function reducer(state: State<Data, Error>, action: DispatchAction<typeof dispatcher>): State<Data, Error> {
    switch(action.type) {
      case 'PENDING':
        return {
          loading: true,
          data: opts.resetOnReload ? undefined : state.data,
          error: opts.resetOnReload ? undefined : state.error,
          successful: opts.resetOnReload ? undefined : state.successful, 
        };
      case 'SUCCESS':
        return {
          ...state,
          loading: false,
          data: action.payload,
          successful: true,
        };
      case 'ERROR':
        return {
          ...state,
          loading: false,
          error: action.payload,
          successful: false,
        }
    }
  }

  const [state, dispatch] = useReducer(reducer, { loading: opts.initialLoading });

  return ({
    run: (args: Omit<Args, PartialArgs>) => dispatcher(args)(dispatch),
    ...state,
  });
};
