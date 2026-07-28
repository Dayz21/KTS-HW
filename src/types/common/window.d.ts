import type { WindowType } from '@kts-specials/mediaproject-utils';

import { LSKey } from 'store/globals/storage/types';

declare global {
  type WindowStorageType = {
    [Key in LSKey]: string | null;
  };

  type WindowWithStorage = WindowType & WindowStorageType;

  interface Window extends WindowWithStorage {
    API_URL_FROM_TEMPLATE: string;
  }
}
