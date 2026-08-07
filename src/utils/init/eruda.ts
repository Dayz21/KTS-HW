export const initEruda = (isDev: boolean) => {
  if (isDev) {
    void import('eruda')
      .then((module) => {
        module.default?.init?.();
      })
      .catch();
  }
};
