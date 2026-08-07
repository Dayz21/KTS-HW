import DownArrow from './down.svg?react';
import ErrorIcon from './error.svg?react';
import SuccessIcon from './success.svg?react';

export enum IconType {
  downArrow = 'downArrow',
  error = 'error',
  success = 'success',
}

export const ICON_MAP = {
  [IconType.downArrow]: DownArrow,
  [IconType.error]: ErrorIcon,
  [IconType.success]: SuccessIcon,
};
