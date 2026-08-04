export type PhoneMask = {
  key: string;
  name: string;
  prefix: string;
  mask: string;
};

export enum PhoneInputStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  DEFAULT = 'default',
}

export type PhoneInputStatusValue = PhoneInputStatus | string;

export type PhoneInputProps = {
  masks: PhoneMask[];
  initialValue?: string;
  onChange: (value: string) => void;

  label?: string;
  className?: string;
  disabled?: boolean;
  status?: PhoneInputStatusValue;
  statusText?: string;
};

export type MaskPart = { type: 'digit'; index: number } | { type: 'static'; value: string };
