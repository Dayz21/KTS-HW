import { loadImages } from '@kts-specials/mediaproject-utils';

import IMAGES from 'assets/images';
import { ApiStore } from 'store/globals/api';
import { IApiStore } from 'store/globals/api/declaration';
import { AppParamsStore } from 'store/globals/appParams';
import { IAppParamsStore } from 'store/globals/appParams/declaration';
import { RouterStore } from 'store/globals/router';
import { IRouterStore } from 'store/globals/router/declaration';
import { SnackbarStore } from 'store/globals/snackbar';
import { ISnackbarStore } from 'store/globals/snackbar/declaration';
import { StorageStore } from 'store/globals/storage';
import { IStorageStore } from 'store/globals/storage/declaration';
import { UiConfigStore } from 'store/globals/uiConfig';
import { IUiConfigStore } from 'store/globals/uiConfig/declaration';
import { UserStore } from 'store/globals/user';
import { IUserStore } from 'store/globals/user/declaration';
import { AppStateModel } from 'store/models/AppStateModel';
import { IAppStateModel } from 'store/models/AppStateModel/declaration';
import { initStoreContext } from 'utils/initStoreContext';

import { type IRootStore } from './declaration';

class RootStore implements IRootStore {
  private _isFirstInit = true;

  readonly appState: IAppStateModel = new AppStateModel();

  readonly appParamsStore: IAppParamsStore = new AppParamsStore();

  readonly routerStore: IRouterStore = new RouterStore(this);

  readonly snackbarStore: ISnackbarStore = new SnackbarStore();

  readonly apiStore: IApiStore = new ApiStore(this);

  readonly userStore: IUserStore = new UserStore(this);

  readonly storageStore: IStorageStore = new StorageStore();

  readonly uiConfigStore: IUiConfigStore = new UiConfigStore(this);

  readonly reload = () => {
    this.appState.reset();
  };

  readonly init = async (): Promise<boolean> => {
    if (!this.appState.initial) {
      return true;
    }

    this.appState.setLoading();

    const results = await Promise.all(this._getInitTasks());

    const success = results.every((ok) => ok);

    if (success) {
      this.appState.setLoadedSuccessfully();
    } else {
      this.appState.setLoadedWithError();
    }

    return success;
  };

  private readonly _getInitTasks = (): Promise<boolean>[] => {
    const tasks: Promise<boolean>[] = [];

    if (this._isFirstInit) {
      tasks.push(this._firstInit());
      this._isFirstInit = false;
    }

    tasks.push(this.uiConfigStore.init());

    return tasks;
  };

  private readonly _firstInit = async (): Promise<boolean> => {
    await loadImages(IMAGES);

    return true;
  };

  readonly destroy = (): void => {
    this.routerStore.destroy();
    this.uiConfigStore.destroy();
  };
}

export const {
  store: rootStore,
  StoreContext: RootStoreContext,
  StoreProvider: RootStoreProvider,
  useStoreContext: useRootStore,
} = initStoreContext(() => new RootStore(), 'rootStore');
