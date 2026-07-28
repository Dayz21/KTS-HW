import { AxiosResponse } from 'axios';

export enum ErrorCodeEnum {
  notAuthorized = 'not_authorized',
  internalError = 'internal_error',
}

export type ErrorResponse = AxiosResponse<{
  code: ErrorCodeEnum;
  message: string;
}> & {
  code: ErrorCodeEnum;
  message: string;
  status: string;
};

export type ExtendedErrorResponse<E> = {
  isError: true;
  data?: E;
  isCancelled: boolean;
};

export type ApiResponse<T, E> =
  | (ExtendedErrorResponse<E> & {
      data?: E;
    })
  | {
      isError: false;
      data: T;
    };
