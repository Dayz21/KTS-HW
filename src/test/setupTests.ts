import '@testing-library/jest-dom';

jest.mock('@kts-specials/mediaproject-stores', () => {
  const { action, computed, makeObservable, observable } = require('mobx');

  class ValueModel<T> {
    private _value: T;

    constructor(value: T) {
      this._value = value;

      makeObservable(this, {
        _value: observable,
        value: computed,
        setValue: action,
      });
    }

    get value(): T {
      return this._value;
    }

    setValue(value: T): void {
      this._value = value;
    }
  }

  return {
    ValueModel,
    init: jest.fn(),
  };
});

jest.mock('framer-motion', () => {
  const React = require('react');

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: {
      div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
        React.createElement('div', props, children),
    },
  };
});
