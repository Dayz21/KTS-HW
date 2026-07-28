import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import { Icon, IconType } from 'components/common/Icon';
import { useListbox } from 'hooks/useListbox';

import { PhoneInputStatus } from '../types';
import { getFlagEmojiUrl } from '../utils';

import { RegionItem } from './RegionItem';
import s from './RegionSelector.module.scss';
import { RegionSelectorProps } from './types';

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  masks,
  selectedMask,
  onChange,
  disabled = false,
  status = PhoneInputStatus.DEFAULT,
}) => {
  const selectedIndex = masks.findIndex((mask) => mask.key === selectedMask?.key);

  const {
    isOpen,
    rootRef,
    triggerRef,
    getItemRef,
    toggle,
    select,
    onTriggerKeyDown,
    onListKeyDown,
  } = useListbox({
    itemCount: masks.length,
    selectedIndex,
    onSelect: (index) => onChange(masks[index]),
    disabled,
  });

  return (
    <div className={s.root} ref={rootRef}>
      <button
        ref={triggerRef}
        className={cn(s.selectedMask, {
          [s.active]: isOpen,
          [s.error]: status === PhoneInputStatus.ERROR,
          [s.success]: status === PhoneInputStatus.SUCCESS,
        })}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggle}
        onKeyDown={onTriggerKeyDown}
      >
        {selectedMask && (
          <>
            <img
              className={s.flag}
              src={getFlagEmojiUrl(selectedMask.key)}
              alt={selectedMask.name}
              width={20}
              height={20}
              draggable={false}
            />
            {selectedMask.prefix}
          </>
        )}
        <Icon type={IconType.downArrow} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={s.itemsContainer}
            initial={{ opacity: 0, y: '110%' }}
            animate={{ opacity: 1, y: '100%' }}
            exit={{ opacity: 0, y: '110%' }}
            transition={{ duration: 0.2 }}
            role="listbox"
            aria-label="Выбор страны"
            onKeyDown={onListKeyDown}
          >
            <div className={s.items}>
              {masks.map((mask, index) => (
                <RegionItem
                  key={mask.key}
                  ref={getItemRef(index)}
                  mask={mask}
                  isSelected={mask.key === selectedMask?.key}
                  onClick={() => select(index)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
