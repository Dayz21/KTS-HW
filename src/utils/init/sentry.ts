import { init } from '@kts-specials/mediaproject-stores';

export const initSentry = () => {
  init(
    {
      dsn: process.env.SENTRY_DSN,
      normalizeDepth: 6,
    },
    import.meta.env.PROD,
    import.meta.env.DEV,
  );
};
