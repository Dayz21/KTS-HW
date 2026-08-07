import React from 'react';

import { DigitField } from '../DigitField';
import { focusNextElement, focusPreviousElement } from '../focusTraversal';
import { PhoneInputStatus } from '../types';
import { getMaskDigitCount, parseMaskParts } from '../utils';

import s from './MaskDigitField.module.scss';

type MaskDigitFieldProps = {
  mask: string;
  digits: string[];
  onDigitsChange: (digits: string[]) => void;
  onPaste: (pastedText: string, startIndex: number) => void;

  disabled?: boolean;
  status?: PhoneInputStatus;
};

export const MaskDigitField: React.FC<MaskDigitFieldProps> = ({
  mask,
  digits,
  onDigitsChange,
  onPaste,
  disabled = false,
  status = PhoneInputStatus.DEFAULT,
}) => {
  const digitCount = getMaskDigitCount(mask);
  const parts = React.useMemo(() => parseMaskParts(mask), [mask]);

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const updateDigits = (nextDigits: string[]) => {
    onDigitsChange(nextDigits);
  };

  const focusDigit = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleDigitInput = (index: number, digit: string) => {
    const nextDigits = [...digits];

    nextDigits[index] = digit;
    updateDigits(nextDigits);

    if (digit && index < digitCount - 1) {
      focusDigit(index + 1);
    }
  };

  const handlePasteDigits = (index: number, pastedText: string) => {
    onPaste(pastedText, index);

    requestAnimationFrame(() => {
      const lastFilledIndex = inputRefs.current.reduce(
        (lastIndex, input, inputIndex) => (input?.value ? inputIndex : lastIndex),
        index,
      );

      focusDigit(lastFilledIndex);
    });
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Backspace':
        event.preventDefault();

        if (digits[index]) {
          const nextDigits = [...digits];

          nextDigits[index] = '';
          updateDigits(nextDigits);
        } else if (index > 0) {
          focusDigit(index - 1);
          const nextDigits = [...digits];

          nextDigits[index - 1] = '';
          updateDigits(nextDigits);
        }

        break;
      case 'ArrowLeft':
        if (index > 0) {
          event.preventDefault();
          focusDigit(index - 1);
        }

        break;
      case 'ArrowRight':
        if (index < digitCount - 1) {
          event.preventDefault();
          focusDigit(index + 1);
        }

        break;

      case 'Delete': {
        event.preventDefault();

        const nextDigits = [...digits];

        nextDigits[index] = '';
        updateDigits(nextDigits);
        break;
      }

      case 'Tab': {
        const isFirst = index === 0;
        const isLast = index === digitCount - 1;

        if ((event.shiftKey && isFirst) || (!event.shiftKey && isLast)) {
          event.preventDefault();

          const target = event.currentTarget;

          requestAnimationFrame(() => {
            if (event.shiftKey) {
              focusPreviousElement(target);
            } else {
              focusNextElement(target);
            }
          });
        }

        break;
      }

      case 'Enter': {
        const form = event.currentTarget.form;

        if (form) {
          event.preventDefault();
          form.requestSubmit();
        }

        break;
      }
    }
  };

  return (
    <div className={s.root}>
      {parts.map((part, partIndex) => {
        if (part.type === 'static') {
          return (
            <span key={`static-${partIndex}`} className={s.separator}>
              {part.value}
            </span>
          );
        }

        return (
          <DigitField
            key={`digit-${part.index}`}
            ref={(element) => {
              inputRefs.current[part.index] = element;
            }}
            disabled={disabled}
            value={digits[part.index]}
            ariaLabel={`Позиция ${part.index + 1} в номере`}
            onChange={(digit) => handleDigitInput(part.index, digit)}
            onPasteDigits={(pastedDigits) => handlePasteDigits(part.index, pastedDigits)}
            onKeyDown={(event) => handleKeyDown(part.index, event)}
            status={status}
          />
        );
      })}
    </div>
  );
};
