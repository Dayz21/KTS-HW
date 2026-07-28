import { PhoneInputStatus, PhoneMask } from '../types';

export type RegionItemProps = {
  mask: PhoneMask;
  onClick: () => void;
  isSelected?: boolean;
  tabIndex?: number;
};

export type RegionSelectorProps = {
  masks: PhoneMask[];
  selectedMask: PhoneMask | null;
  onChange: (mask: PhoneMask) => void;

  disabled?: boolean;
  status?: PhoneInputStatus;
};
