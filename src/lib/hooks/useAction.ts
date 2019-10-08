import { useEffect } from 'react';

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
  const reload: () => Promise<Data> = () => run(args);
  
  useEffect(() => {
    reload();
  }, []);

  return ({
    run: reload,
    ...state,
  });
};
