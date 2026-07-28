import {
  ApiCallArgs,
  ApiStore as BaseApiStore,
  HttpAuthorizationScheme,
} from '@kts-front/call-api';

import { SnackbarServerMessageList } from 'config/snackbars';
import { ErrorResponse as BaseErrorResponse } from 'store/globals/api/types';
import { LSKey } from 'store/globals/storage/types';
import { ApiRequest } from 'store/models/ApiRequest';
import { IApiRequest } from 'store/models/ApiRequest/declaration';

import { type IRootStore } from '../root/declaration';

import { IApiStore } from './declaration';

export default class ApiStore extends BaseApiStore implements IApiStore {
  private readonly _rootStore: IRootStore;

  constructor(rootStore: IRootStore) {
    super({
      baseUrl: '/',
      getAuthorizationCallback: () => {
        const token = this._rootStore.storageStore.getItem(LSKey.token);

        if (token === null) {
          return null;
        }

        return {
          scheme: HttpAuthorizationScheme.Bearer,
          data: token,
        };
      },
    });

    this._rootStore = rootStore;
  }

  createExtendedRequest = <ResponseData, ErrorResponse extends BaseErrorResponse>(
    requestParams?: Partial<ApiCallArgs<Record<string, unknown>>> & {
      errorMap?: SnackbarServerMessageList;
      showExpectedError?: boolean;
      showUnexpectedError?: boolean;
    },
  ): IApiRequest<ResponseData, ErrorResponse> => {
    return new ApiRequest<ResponseData, ErrorResponse>({
      baseRequest: super.createRequest(requestParams),
      rootStore: this._rootStore,
      showExpectedError: requestParams?.showExpectedError,
      showUnexpectedError: requestParams?.showUnexpectedError,
      errorMap: requestParams?.errorMap,
    });
  };
}
