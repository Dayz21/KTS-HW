export enum LSKey {
  token = 'token',
}

export interface StorageLikeObject<KeyT extends LSKey = LSKey> {
  getItem: (key: KeyT) => string | null;
  setItem: (key: KeyT, value: string) => void;
  removeItem: (key: KeyT) => void;
}
