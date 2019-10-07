import { ApiMiddlewareBag, ApiResponse } from '../types';

export default (response: ApiResponse, { resolve }: ApiMiddlewareBag): void => {
  resolve(response);
};
