import { AppParamsStore as BaseAppParamsStore } from '@kts-specials/mediaproject-stores';

export interface IAppParamsStore extends BaseAppParamsStore {
  isMobile: boolean;
}
