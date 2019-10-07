import { AxiosResponse, AxiosError } from 'axios';
import { DefaultConfig, MiddlewareBag } from '../types';

export type Config = DefaultConfig & {
  maxPollAttempts: number;
  maxErrorAttempts: number;
};

export type ApiResponse<T = any> = AxiosResponse<T>;

export type ApiError = AxiosError;

export type ApiRejectionError = ApiError | 'max_poll_error' | 'network_error';

export type ApiMiddlewareBag = MiddlewareBag<Config, ApiResponse, ApiError, ApiRejectionError>;
