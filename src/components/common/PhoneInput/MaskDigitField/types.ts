import { PhoneInputStatus } from '../types';

export type MaskDigitFieldProps = {
  mask: string;
  digits: string[];
  onDigitsChange: (digits: string[]) => void;

  disabled?: boolean;
  status?: PhoneInputStatus;
};
