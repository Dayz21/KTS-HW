import * as React from 'react';

import { PhoneInput } from 'components/common/PhoneInput';
import { PhoneInputStatus } from 'components/common/PhoneInput/types';

import s from './PreviewPage.module.scss';
import { MASKS } from './mock';

const PreviewPage: React.FC = () => {
  const [phone, setPhone] = React.useState('');

  return (
    <div className={s.root}>
      <div className={s.title}>ДЗ по форме ввода телефона</div>

      <PhoneInput masks={MASKS} value={phone} onChange={setPhone} />

      <PhoneInput disabled masks={MASKS} value="+7" />

      <PhoneInput
        masks={MASKS}
        value="+71234567890"
        status={PhoneInputStatus.SUCCESS}
        statusText="Номер телефона введен верно"
      />

      <PhoneInput
        masks={MASKS}
        value="+71234567890"
        status={PhoneInputStatus.ERROR}
        statusText="Неправильный номер телефона"
      />
    </div>
  );
};

export default PreviewPage;
