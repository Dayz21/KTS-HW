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
  private readonly _selectedMaskKey = new ValueModel<string | null>(null);

  constructor({ masks, initialValue = '', onChange }: PhoneInputStoreParams) {
    this._masks = masks;
    this._onChange = onChange;
    this._value.setValue(normalizePhoneInput(masks, initialValue));
    this._selectedMaskKey.setValue(this._resolveInitialMaskKey(initialValue));
    this._value.setValue(normalizePhoneInput(masks, initialValue, this._selectedMaskKey.value));

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
    return normalizePhoneInput(this._masks, this._value.value, this._selectedMaskKey.value);
  }

  get selectedMask(): PhoneMask | null {
    if (this._masks.length === 0) {
      return null;
    }

    const normalized = this.normalizedValue;

    if (!normalized?.startsWith('+')) {
      return this._masks.find((mask) => mask.key === this._selectedMaskKey.value) ?? this._masks[0];
    }

    const matchingMasks = this._masks.filter((mask) => normalized.startsWith(mask.prefix));

    if (this._selectedMaskKey.value) {
      const preferred = matchingMasks.find((mask) => mask.key === this._selectedMaskKey.value);

      if (preferred) {
        return preferred;
      }
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
    const normalized = normalizePhoneInput(this._masks, value, this._selectedMaskKey.value);

    if (normalized !== this._value.value) {
      this._value.setValue(normalized);
    }

    this._syncSelectedMaskKey(normalized);
  };

  changeRegion = (mask: PhoneMask): void => {
<<<<<<< HEAD
    if (mask.key === this.selectedMask?.key) {
      return;
    }

=======
    this._selectedMaskKey.setValue(mask.key);
>>>>>>> 22a1fbe (fix: доработать тесты, Storybook и выбор региона с одинаковым префиксом)
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

  private _resolveInitialMaskKey = (value: string): string | null => {
    if (this._masks.length === 0) {
      return null;
    }

    const normalized = normalizePhoneInput(this._masks, value);

    if (!normalized?.startsWith('+')) {
      return this._masks[0].key;
    }

    return (findMaskByPrefix(this._masks, normalized) ?? this._masks[0]).key;
  };

  private _syncSelectedMaskKey = (normalized: string): void => {
    if (this._masks.length === 0) {
      this._selectedMaskKey.setValue(null);

      return;
    }

    const matchingMasks = this._masks.filter((mask) => normalized.startsWith(mask.prefix));
    const preferredStillMatches =
      this._selectedMaskKey.value &&
      matchingMasks.some((mask) => mask.key === this._selectedMaskKey.value);

    if (!preferredStillMatches) {
      this._selectedMaskKey.setValue(
        (findMaskByPrefix(this._masks, normalized) ?? this._masks[0]).key,
      );
    }
  };

  private _emitChange = (nextValue: string): void => {
    this._value.setValue(nextValue);
    this._onChange?.(nextValue);
  };
}
