import cn from 'classnames';
import * as React from 'react';

import s from './Icon.module.scss';
import { ICON_MAP } from './icons';
import type { IconProps } from './types';

const Icon: React.FC<IconProps> = ({
  type,
  className,
  size = 24,
  'aria-label': ariaLabel,
  ...svgProps
}) => {
  const IconComponent = ICON_MAP[type];

  return (
    <IconComponent
      {...svgProps}
      className={cn(s.icon, className)}
      width={size}
      height={size}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
    />
  );
};

export default React.memo(Icon);
