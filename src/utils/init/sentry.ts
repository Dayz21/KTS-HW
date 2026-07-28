import { init } from '@kts-specials/mediaproject-stores';

import { IAppParamsStore } from 'store/globals/appParams/declaration';

export const initSentry = ({ isProd, isDev }: IAppParamsStore) => {
  init(
    {
      dsn: process.env.SENTRY_DSN,
      normalizeDepth: 6,
    },
    isProd,
    isDev,
  );
};
