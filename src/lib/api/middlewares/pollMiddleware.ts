import { ApiMiddlewareBag, ApiResponse } from '../types';

export default (
  response: ApiResponse, {
    responses,
    reject,
    config,
  }: ApiMiddlewareBag
) => {
  const pollResponses = responses.filter(response => response.status === 202);
  // If we have had more 202 errors than the limit, we should stop.
  if (response.status === 202 && pollResponses.length >= config.maxPollAttempts) {
    reject('max_poll_error');
  }
};
