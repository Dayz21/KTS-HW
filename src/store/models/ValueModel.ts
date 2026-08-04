import { makeAutoObservable } from 'mobx';

export class ValueModel<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
    makeAutoObservable(this);
  }

  setValue(value: T): void {
    this.value = value;
  }
}
