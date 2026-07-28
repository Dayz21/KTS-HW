import { type IGlobalStore } from 'store/interfaces';

export interface IRouterStore extends IGlobalStore {
  push: (to: string) => void;
  replace: (to: string) => void;
  goBack: () => void;
}
