import cn from 'classnames';
import React from 'react';

import { PhoneInputStatus } from '../types';

import s from './DigitField.module.scss';
import { DigitFieldProps } from './types';

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
          [s.error]: status === PhoneInputStatus.ERROR,
          [s.success]: status === PhoneInputStatus.SUCCESS,
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
