import { ApiCallArgs, MockApiCallResponse } from '@kts-front/call-api';

import { ErrorResponse as BaseErrorResponse, ApiResponse } from 'store/globals/api/types';

export type ApiRequestCallParams<
  T,
  E,
  R extends Record<string, unknown> | FormData = Record<string, unknown>,
> = Partial<ApiCallArgs<R>> & {
  mockResponse?: MockApiCallResponse<T, E>;
};

export type IApiRequestCall<ResponseData, ErrorResponse extends BaseErrorResponse> = <
  T extends ResponseData = ResponseData,
  E extends ErrorResponse = ErrorResponse,
  R extends Record<string, unknown> | FormData = Record<string, unknown>,
>(
  params?: ApiRequestCallParams<T, E, R>,
) => Promise<ApiResponse<T, E>>;

export interface IApiRequest<
  ResponseData,
  ErrorResponse extends BaseErrorResponse = BaseErrorResponse,
> {
  isLoading: boolean;
  isSuccess: boolean;
  isFailed: boolean;
  isLoaded: boolean;

  call: IApiRequestCall<ResponseData, ErrorResponse>;

  cancel: () => void;
  reset: () => void;
  destroy: () => void;
}
