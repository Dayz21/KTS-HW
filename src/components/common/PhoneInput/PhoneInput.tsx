import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useLocalStore } from 'store/hooks';

import { Icon, IconType } from '../Icon';

import { MaskDigitField } from './MaskDigitField';
import s from './PhoneInput.module.scss';
import { RegionSelector } from './RegionSelector';
import { PhoneInputStore } from './store';
import { PhoneInputProps, PhoneInputStatus } from './types';

const PhoneInput: React.FC<PhoneInputProps> = ({
  masks,
  value,
  onChange,
  className,
  disabled = false,
  status = PhoneInputStatus.DEFAULT,
  statusText,
}) => {
  const phoneInputStore = useLocalStore(
    () => new PhoneInputStore({ masks, value, onChange }),
    [masks],
  );

  React.useEffect(() => {
    if (value !== undefined) {
      phoneInputStore.syncValue(value);
    }
  }, [value, phoneInputStore]);

  const selectedMask = phoneInputStore.selectedMask;

  return (
    <div className={s.root}>
      <div className={cn(s.numberInput, className)}>
        <RegionSelector
          masks={phoneInputStore.masks}
          selectedMask={selectedMask}
          onChange={phoneInputStore.changeRegion}
          disabled={disabled}
          status={status}
        />
        {selectedMask && (
          <MaskDigitField
            mask={selectedMask.mask}
            digits={phoneInputStore.digits}
            onDigitsChange={phoneInputStore.setDigits}
            disabled={disabled}
            status={status}
          />
        )}
      </div>

      {statusText && status !== PhoneInputStatus.DEFAULT && (
        <div className={cn(s.statusText, s[status])}>
          <Icon
            type={status === PhoneInputStatus.SUCCESS ? IconType.success : IconType.error}
            size={16}
          />
          {statusText}
        </div>
      )}
    </div>
  );
};

export default observer(PhoneInput);
