import { ValueModel } from '@kts-specials/mediaproject-stores';

import { API_READY_STATE, ENDPOINTS } from 'config/api';
import type { IRootStore } from 'store/globals/root/declaration';
import type { IApiRequest } from 'store/models/ApiRequest/declaration';
import { mergeAll } from 'utils/merge';

import { INITIAL_STATE } from './config';
import type { IUiConfigStore } from './declaration';
import type { UiConfigType, UiConfigServerType } from './types';

export class UiConfigStore implements IUiConfigStore {
  private readonly _requests: {
    getConfig: IApiRequest<UiConfigServerType>;
  };

  private _config = new ValueModel<UiConfigType>(INITIAL_STATE);

  constructor(readonly rootStore: IRootStore) {
    this._requests = {
      getConfig: rootStore.apiStore.createExtendedRequest(ENDPOINTS.uiConfig),
    };
  }

  get global(): UiConfigType['global'] {
    return this._config.value.global;
  }

  get pages(): UiConfigType['pages'] {
    return this._config.value.pages;
  }

  readonly init = async (): Promise<boolean> => {
    const isApiReady = API_READY_STATE.uiConfig;

    const response = await this._requests.getConfig.call<UiConfigServerType, never>(
      isApiReady
        ? undefined
        : {
            mockResponse: {
              isError: false,
              data: INITIAL_STATE,
            },
          },
    );

    if (response.isError) {
      return false;
    }

    this._config.setValue(mergeAll(this._config.value, response.data));

    return true;
  };

  readonly destroy = (): void => {
    this._requests.getConfig.destroy();
  };
}
