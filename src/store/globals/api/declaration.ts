import { ApiCallArgs, ApiStore as BaseApiStore } from '@kts-front/call-api';

import { SnackbarServerMessageList } from 'config/snackbars';
import { ErrorResponse } from 'store/globals/api/types';
import { IApiRequest } from 'store/models/ApiRequest/declaration';

export interface IApiStore extends BaseApiStore {
  createExtendedRequest: <ResponseData, BaseErrorResponse extends ErrorResponse>(
    requestParams?: Partial<ApiCallArgs<Record<string, unknown>>> & {
      errorMap?: SnackbarServerMessageList;
      showExpectedError?: boolean;
      showUnexpectedError?: boolean;
    },
  ) => IApiRequest<ResponseData, BaseErrorResponse>;
}
