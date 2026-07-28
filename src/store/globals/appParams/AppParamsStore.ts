import { AppParamsStore as BaseAppParamsStore } from '@kts-specials/mediaproject-stores';
import { checkMobile } from '@kts-specials/mediaproject-utils';
import { makeObservable, observable } from 'mobx';

import { API_URL } from 'config/api/apiUrl';

import { IAppParamsStore } from './declaration';

export class AppParamsStore extends BaseAppParamsStore implements IAppParamsStore {
  isMobile: boolean;

  constructor() {
    super(API_URL);

    this.isMobile = checkMobile();

    makeObservable<this>(this, {
      isMobile: observable,
    });
  }
}
