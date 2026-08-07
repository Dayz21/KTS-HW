import * as React from 'react';

import { PhoneInput } from 'components/common/PhoneInput';
import { PhoneInputStatus } from 'components/common/PhoneInput/types';

import s from './PreviewPage.module.scss';
import { MASKS } from './mock';

const getPhoneValidation = (phone: string): { status: PhoneInputStatus; statusText: string } => {
  const isValid = phone.length > 0 && !phone.includes('*');

  return isValid
    ? { status: PhoneInputStatus.SUCCESS, statusText: 'Номер телефона введен верно' }
    : { status: PhoneInputStatus.ERROR, statusText: 'Неправильный номер телефона' };
};

const PreviewPage: React.FC = () => {
  const [, setPhone] = React.useState('');
  const [validationPhone, setValidationPhone] = React.useState('');
  const [validationStatus, setValidationStatus] = React.useState(PhoneInputStatus.DEFAULT);
  const [validationStatusText, setValidationStatusText] = React.useState<string>();

  const handleValidationPhoneChange = (value: string) => {
    setValidationPhone(value);
    setValidationStatus(PhoneInputStatus.DEFAULT);
    setValidationStatusText(undefined);
  };

  const handleValidationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = getPhoneValidation(validationPhone);

    setValidationStatus(validation.status);
    setValidationStatusText(validation.statusText);
  };

  return (
    <div className={s.root}>
      <div className={s.title}>ДЗ по форме ввода телефона</div>

      <PhoneInput label="Введите номер телефона" masks={MASKS} onChange={setPhone} />

      <PhoneInput
        label="Введите номер телефона (disabled)"
        disabled
        masks={MASKS}
        initialValue="+7"
        onChange={() => {}}
      />

      <PhoneInput
        label="Введите номер телефона (success)"
        masks={MASKS}
        initialValue="+71234567890"
        onChange={() => {}}
        status={PhoneInputStatus.SUCCESS}
        statusText="Номер телефона введен верно"
      />

      <PhoneInput
        label="Введите номер телефона (error)"
        masks={MASKS}
        initialValue="+71234567890"
        onChange={() => {}}
        status={PhoneInputStatus.ERROR}
        statusText="Неправильный номер телефона"
      />

      <form className={s.validationForm} onSubmit={handleValidationSubmit}>
        <PhoneInput
          label="Проверка по Enter"
          masks={MASKS}
          onChange={handleValidationPhoneChange}
          status={validationStatus}
          statusText={validationStatusText}
        />
        <span className={s.validationHint}>Нажмите Enter для проверки номера</span>
        <button type="submit" className={s.validationSubmit}>
          Проверить
        </button>
      </form>
    </div>
  );
};

export default PreviewPage;
