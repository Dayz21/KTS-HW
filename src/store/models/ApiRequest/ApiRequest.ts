import { ApiRequest as BaseApiRequest } from '@kts-front/call-api/dist/stores/ApiRequest';

import { SnackbarServerMessageList } from 'config/snackbars';
import { ApiResponse, ErrorResponse as BaseErrorResponse } from 'store/globals/api/types';
import { type IRootStore } from 'store/globals/root/declaration';
import parseApiResponse from 'utils/parseApiResponse';

import { ApiRequestCallParams, IApiRequest } from './declaration';

export default class ApiRequest<
  ResponseData,
  ErrorResponse extends BaseErrorResponse = BaseErrorResponse,
> implements IApiRequest<ResponseData, ErrorResponse>
{
  private readonly _baseRequest: BaseApiRequest<ResponseData, ErrorResponse>;
  private readonly _requestUrl: string;
  private readonly _errorResponseMap: SnackbarServerMessageList | null;
  private readonly _showExpectedError: boolean;
  private readonly _showUnexpectedError: boolean;
  private readonly _rootStore: IRootStore;

  constructor({
    baseRequest,
    errorMap,
    showExpectedError,
    showUnexpectedError,
    rootStore,
  }: {
    baseRequest: BaseApiRequest<ResponseData, ErrorResponse>;
    errorMap?: SnackbarServerMessageList;
    showExpectedError?: boolean;
    showUnexpectedError?: boolean;
    rootStore: IRootStore;
  }) {
    this._baseRequest = baseRequest;
    this._requestUrl = baseRequest.axiosInstance.getUri();
    this._errorResponseMap = errorMap ?? null;

    this._showExpectedError = showExpectedError ?? true;
    this._showUnexpectedError = showUnexpectedError ?? true;

    this._rootStore = rootStore;
  }

  get isLoading(): boolean {
    return this._baseRequest.isLoading;
  }

  get isSuccess(): boolean {
    return this._baseRequest.isSuccess;
  }

  get isFailed(): boolean {
    return this._baseRequest.isFailed;
  }

  get isLoaded(): boolean {
    return this._baseRequest.isLoaded;
  }

  call = async <
    T extends ResponseData = ResponseData,
    E extends ErrorResponse = ErrorResponse,
    R extends Record<string, unknown> | FormData = Record<string, unknown>,
  >(
    params?: ApiRequestCallParams<T, E, R>,
  ): Promise<ApiResponse<T, E>> => {
    const response = parseApiResponse<T, E>(await this._baseRequest.call<T, E, R>(params));

    if (response.isError && !response.isCancelled) {
      const errorMessage =
        response.data?.data && this._errorResponseMap
          ? this._errorResponseMap[response.data.data.code]
          : null;

      if (this._showExpectedError && errorMessage) {
        this._rootStore.snackbarStore.openSnackbarMessage(errorMessage);
      } else if (this._showUnexpectedError && !errorMessage) {
        this._rootStore.snackbarStore.triggerDefaultErrorMessage();
      }

      if (response.data) {
        // отправка данных в сентри
        console.warn({ error: response.data.code, url: this._requestUrl });
      }
    }

    return response;
  };

  cancel(): void {
    this._baseRequest.cancel();
  }

  reset(): void {
    this._baseRequest.reset();
  }

  destroy(): void {
    this._baseRequest.destroy();
  }
}
