import type { TDefaultPageConfig } from '../types';

type TUiParams = {
  title: string;
  description: string;
};

export type TOnboardingPageConfig = TDefaultPageConfig<TUiParams>;
