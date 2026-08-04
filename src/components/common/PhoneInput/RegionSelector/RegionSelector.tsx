import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import { Icon, IconType } from 'components/common/Icon';
import { useListbox } from 'hooks/useListbox';

import { FlagIcon } from '../FlagIcon';
import { RegionItem } from '../RegionItem';
import { PhoneInputStatus, PhoneInputStatusValue, PhoneMask } from '../types';

import s from './RegionSelector.module.scss';
import { dropdownListAnimation } from './animation';

type RegionSelectorProps = {
  masks: PhoneMask[];
  selectedMask: PhoneMask | null;
  onChange: (mask: PhoneMask) => void;

  disabled?: boolean;
  status?: PhoneInputStatusValue;
};

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
          [s.error]: status === 'error',
          [s.success]: status === 'success',
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
            <FlagIcon mask={selectedMask} />
            {selectedMask.prefix}
          </>
        )}
        <Icon type={IconType.downArrow} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={s.itemsContainer}
            {...dropdownListAnimation}
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
