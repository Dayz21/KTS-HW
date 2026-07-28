import cn from 'classnames';
import React from 'react';

import { getFlagEmojiUrl } from '../utils';

import s from './RegionSelector.module.scss';
import { RegionItemProps } from './types';

export const RegionItem = React.forwardRef<HTMLButtonElement, RegionItemProps>(
  ({ mask, onClick, isSelected = false, tabIndex = -1 }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(s.item)}
        type="button"
        role="option"
        aria-selected={isSelected}
        tabIndex={tabIndex}
        onClick={onClick}
      >
        <img
          className={s.flag}
          src={getFlagEmojiUrl(mask.key)}
          alt={mask.name}
          width={20}
          height={20}
          draggable={false}
        />
        <span>
          {mask.prefix}
          <span className={s.itemName}>{mask.name}</span>
        </span>
      </button>
    );
  },
);

RegionItem.displayName = 'RegionItem';
