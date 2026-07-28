import { DEFAULT_ONBOARDING_CONFIG } from './defaults';
import type { UiConfigType } from './types';

export const INITIAL_STATE: UiConfigType = {
  version: '',
  global: {
    analytics: {},
    ui: {
      modals: {},
    },
    consts: {},
  },
  pages: {
    onboarding: DEFAULT_ONBOARDING_CONFIG,
  },
};
