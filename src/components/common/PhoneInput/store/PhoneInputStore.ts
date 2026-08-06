import { action, computed, makeObservable } from 'mobx';

import { ILocalStore } from 'store/interfaces/ILocalStore';
import { ValueModel } from 'store/models';

import { PhoneMask } from '../types';
import {
  extractMaskDigits,
  findMaskByPrefix,
  formatPhoneTemplate,
  formatPhoneValue,
  normalizePhoneInput,
} from '../utils';

export type PhoneInputStoreParams = {
  masks: PhoneMask[];
  initialValue?: string;
  onChange?: (value: string) => void;
};

export class PhoneInputStore implements ILocalStore {
  private readonly _masks: PhoneMask[];
  private readonly _onChange?: (value: string) => void;
  private readonly _value = new ValueModel<string>('');

  constructor({ masks, initialValue = '', onChange }: PhoneInputStoreParams) {
    this._masks = masks;
    this._onChange = onChange;
    this._value.setValue(normalizePhoneInput(masks, initialValue));

    makeObservable(this, {
      masks: computed,
      normalizedValue: computed,
      selectedMask: computed,
      digits: computed,
      syncValue: action.bound,
      changeRegion: action.bound,
      setDigits: action.bound,
    });
  }

  get masks(): PhoneMask[] {
    return this._masks;
  }

  get normalizedValue(): string {
    return normalizePhoneInput(this._masks, this._value.value);
  }

  get selectedMask(): PhoneMask | null {
    if (this._masks.length === 0) {
      return null;
    }

    const normalized = this.normalizedValue;

    if (!normalized?.startsWith('+')) {
      return this._masks[0];
    }

    return findMaskByPrefix(this._masks, normalized) ?? this._masks[0];
  }

  get digits(): string[] {
    const mask = this.selectedMask;

    if (!mask) {
      return [];
    }

    return extractMaskDigits(mask.prefix, mask.mask, this.normalizedValue);
  }

  syncValue = (value: string): void => {
    const normalized = normalizePhoneInput(this._masks, value);

    if (normalized !== this._value.value) {
      this._value.setValue(normalized);
    }
  };

  changeRegion = (mask: PhoneMask): void => {
    if (mask.key === this.selectedMask?.key) {
      return;
    }

    this._emitChange(formatPhoneTemplate(mask.prefix, mask.mask));
  };

  setDigits = (digits: string[]): void => {
    const mask = this.selectedMask;

    if (!mask) {
      return;
    }

    this._emitChange(formatPhoneValue(mask.prefix, mask.mask, digits));
  };

  destroy = (): void => {};

  private _emitChange = (nextValue: string): void => {
    this._value.setValue(nextValue);
    this._onChange?.(nextValue);
  };
}
