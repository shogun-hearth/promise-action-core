import PromiseAction from '../promiseAction';
import usePromiseAction, { State, Options } from './usePromiseAction';

type Result<Data, Error> = State<Data, Error> & {
  run: () => Promise<Data>;
};

export default <Args, Data, Error>(
  promiseAction: PromiseAction<Args, Data, Error>,
  args: Args,
  partialOpts: Partial<Options> = {},
): Result<Data, Error> => {
  const { run, ...state } = usePromiseAction(promiseAction, {}, partialOpts);
  return ({
    run: () => run(args),
    ...state,
  });
};
