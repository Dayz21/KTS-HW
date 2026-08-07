import { action, computed, makeObservable } from 'mobx';

import { ILocalStore } from 'store/interfaces/ILocalStore';
import { ValueModel } from 'store/models';

import { PhoneMask } from '../types';
import {
  extractMaskDigits,
  extractPastedMaskDigits,
  formatPhoneTemplate,
  formatPhoneValue,
  getMaskDigitCount,
  hasInternationalPrefix,
  normalizePhoneInput,
  resolveMask,
  resolveMaskFromPaste,
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
      pasteDigits: action.bound,
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

    return resolveMask(this._masks, normalized, this._selectedMaskKey.value);
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
    if (mask.key === this.selectedMask?.key) {
      return;
    }

    this._selectedMaskKey.setValue(mask.key);
    this._emitChange(formatPhoneTemplate(mask.prefix, mask.mask));
  };

  setDigits = (digits: string[]): void => {
    const mask = this.selectedMask;

    if (!mask) {
      return;
    }

    this._emitChange(formatPhoneValue(mask.prefix, mask.mask, digits));
  };

  pasteDigits = (pastedText: string, startIndex: number): void => {
    if (!pastedText.trim() || this._masks.length === 0) {
      return;
    }

    const currentMask = this.selectedMask;

    if (!currentMask) {
      return;
    }

    const targetMask = resolveMaskFromPaste(this._masks, pastedText, this._selectedMaskKey.value);
    const isInternationalPaste = hasInternationalPrefix(pastedText);
    const maskSwitched = targetMask.key !== currentMask.key;
    const pastedDigits = extractPastedMaskDigits(targetMask.prefix, targetMask.mask, pastedText);

    if (!pastedDigits) {
      return;
    }

    this._selectedMaskKey.setValue(targetMask.key);

    const digitCount = getMaskDigitCount(targetMask.mask);

    if (isInternationalPaste || maskSwitched) {
      const digits = Array.from({ length: digitCount }, (_, index) => pastedDigits[index] ?? '');

      this._emitChange(formatPhoneValue(targetMask.prefix, targetMask.mask, digits));

      return;
    }

    const nextDigits = [...this.digits];

    for (
      let offset = 0;
      offset < pastedDigits.length && startIndex + offset < digitCount;
      offset += 1
    ) {
      nextDigits[startIndex + offset] = pastedDigits[offset];
    }

    this._emitChange(formatPhoneValue(targetMask.prefix, targetMask.mask, nextDigits));
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

    return resolveMask(this._masks, normalized).key;
  };

  private _syncSelectedMaskKey = (normalized: string): void => {
    if (this._masks.length === 0) {
      this._selectedMaskKey.setValue(null);

      return;
    }

    if (!normalized?.startsWith('+')) {
      return;
    }

    const resolvedMask = resolveMask(this._masks, normalized, this._selectedMaskKey.value);

    if (resolvedMask.key !== this._selectedMaskKey.value) {
      this._selectedMaskKey.setValue(resolvedMask.key);
    }
  };

  private _emitChange = (nextValue: string): void => {
    this._value.setValue(nextValue);
    this._onChange?.(nextValue);
  };
}
