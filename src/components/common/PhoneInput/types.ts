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

export type PhoneInputProps = {
  masks: PhoneMask[];
  value?: string;
  onChange?: (value: string) => void;

  className?: string;
  disabled?: boolean;
  status?: PhoneInputStatus;
  statusText?: string;
};

export type MaskPart = { type: 'digit'; index: number } | { type: 'static'; value: string };
