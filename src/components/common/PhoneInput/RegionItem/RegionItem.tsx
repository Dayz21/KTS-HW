import cn from 'classnames';
import React from 'react';

import { FlagIcon } from '../FlagIcon';
import { PhoneMask } from '../types';

import s from './RegionItem.module.scss';

type RegionItemProps = {
  mask: PhoneMask;
  onClick: () => void;
  isSelected?: boolean;
  tabIndex?: number;
};

export const RegionItem = React.forwardRef<HTMLButtonElement, RegionItemProps>(
  ({ mask, onClick, isSelected = false, tabIndex = -1 }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(s.root)}
        type="button"
        role="option"
        aria-selected={isSelected}
        tabIndex={tabIndex}
        onClick={onClick}
      >
        <FlagIcon mask={mask} />
        <span>
          {mask.prefix}
          <span className={s.name}>{mask.name}</span>
        </span>
      </button>
    );
  },
);

RegionItem.displayName = 'RegionItem';
