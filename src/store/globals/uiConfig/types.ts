import type { TOnboardingPageConfig } from './defaults/onboardingPage/types';

export type UiConfigObjectType = Record<string, unknown>;

type UiConfigGlobalType = {
  analytics: UiConfigObjectType;
  ui: {
    /** общие модалки: авторизация, логаут, попапы и тд */
    modals: UiConfigObjectType;
  };
  consts: UiConfigObjectType;
};

type UiConfigPagesType = {
  onboarding: TOnboardingPageConfig;
};

export type UiConfigType = {
  version: string;

  /** глобальные настройки проекта: аналитика, константы, ui конфиги общих компонентов */
  global: UiConfigGlobalType;

  /** локальные настройки страниц */
  pages: UiConfigPagesType;
};

export type UiConfigServerType = DeepPartial<UiConfigType>;
