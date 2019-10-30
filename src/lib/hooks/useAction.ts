import { useEffect, useCallback } from 'react';

import PromiseAction from '../promiseAction';
import useLazyAction, { State, Options } from './useLazyAction';

type Result<Data, Error> = State<Data, Error> & {
  run: () => Promise<Data>;
};

export default <Args, Data, Error>(
  promiseAction: PromiseAction<Args, Data, Error>,
  args: Args,
  partialOpts: Partial<Options> = {},
): Result<Data, Error> => {
  const { run, ...state } = useLazyAction(promiseAction, {}, { initialLoading: true, ...partialOpts });
  const reload = useCallback(() => run(args), [args]);
  
  useEffect(() => {
    reload();
  }, [JSON.stringify(args)]);

  return ({
    run: reload,
    ...state,
  });
};
