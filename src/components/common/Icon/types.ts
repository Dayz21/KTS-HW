import type { ComponentProps, FunctionComponent } from 'react';

import { IconType } from './icons';

export type SvgIconComponent = FunctionComponent<ComponentProps<'svg'> & { title?: string }>;

export type IconProps = {
  type: IconType;
  className?: string;
  size?: number | string;
} & Omit<ComponentProps<'svg'>, 'name' | 'width' | 'height'>;
