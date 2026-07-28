import { type IRootStore } from 'store/globals/root/declaration';

import { IRouterStore } from './declaration';

export class RouterStore implements IRouterStore {
  constructor(public readonly rootStore: IRootStore) {}

  readonly init = (): Promise<boolean> => {
    return Promise.resolve(true);
  };

  readonly destroy = (): void => {};

  readonly push = (_to: string): void => {};

  readonly replace = (_to: string): void => {};

  readonly goBack = (): void => {};
}
