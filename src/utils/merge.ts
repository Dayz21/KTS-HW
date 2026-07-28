import deepmerge from 'deepmerge';

export const mergeAll = <T extends object>(base: T, ...objects: DeepPartial<T>[]): T =>
  deepmerge.all([base, ...objects], {
    arrayMerge: (_, source: unknown[]) => source,
  }) as T;
