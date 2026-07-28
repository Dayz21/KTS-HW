import type { IGlobalStore } from 'store/interfaces';

import type { UiConfigType } from './types';

export interface IUiConfigStore extends IGlobalStore {
  global: UiConfigType['global'];
  pages: UiConfigType['pages'];
}
