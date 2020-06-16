import { AxiosResponse, AxiosError } from 'axios';

import { DefaultConfig, MiddlewareBag } from '../types';
import { ApiNetworkError, ApiMaxPollError } from './errors';

export type Config = DefaultConfig & {
  maxPollAttempts: number;
  maxErrorAttempts: number;
};

export type ApiResponse<T = any> = AxiosResponse<T>;

export type ApiError = AxiosError;

export type ApiRejectionError = ApiError | ApiMaxPollError | ApiNetworkError;

export type ApiMiddlewareBag = MiddlewareBag<Config, ApiResponse, ApiError, ApiRejectionError>;
