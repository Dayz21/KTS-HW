import { PhoneInputStatus } from '../types';

export type DigitFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onPasteDigits?: (digits: string) => void;
  disabled?: boolean;
  ariaLabel?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  status?: PhoneInputStatus;
};
