import cn from 'classnames';
import React from 'react';

import { PhoneInputStatus, PhoneInputStatusValue } from '../types';

import s from './DigitField.module.scss';

type DigitFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onPasteDigits?: (digits: string) => void;
  disabled?: boolean;
  ariaLabel?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  status?: PhoneInputStatusValue;
};

export const DigitField = React.forwardRef<HTMLInputElement, DigitFieldProps>(
  (
    {
      value,
      onChange,
      onPasteDigits,
      disabled = false,
      onKeyDown,
      ariaLabel,
      status = PhoneInputStatus.DEFAULT,
    },
    ref,
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputDigits = event.target.value.replace(/\D/g, '');

      onChange(inputDigits.slice(-1));
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      if (!onPasteDigits) {
        return;
      }

      const pastedDigits = event.clipboardData.getData('text').replace(/\D/g, '');

      if (!pastedDigits) {
        return;
      }

      event.preventDefault();
      onPasteDigits(pastedDigits);
    };

    return (
      <input
        ref={ref}
        className={cn(s.root, {
          [s.error]: status === 'error',
          [s.success]: status === 'success',
        })}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        disabled={disabled}
        value={value}
        aria-label={ariaLabel}
        onChange={handleChange}
        onPaste={handlePaste}
        onKeyDown={onKeyDown}
      />
    );
  },
);

DigitField.displayName = 'DigitField';
