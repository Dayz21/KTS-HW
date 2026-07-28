type DeepPartial<T> = T extends {
  [key in keyof T]: T[key];
}
  ? {
      [K in keyof T]?: DeepPartial<T[K]>;
    }
  : T;
