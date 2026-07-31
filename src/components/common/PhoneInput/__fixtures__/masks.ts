import { PhoneMask } from '../types';

export const TEST_MASKS: PhoneMask[] = [
  {
    key: 'ru',
    name: 'Россия',
    prefix: '+7',
    mask: '(***) ***-**-**',
  },
  {
    key: 'us',
    name: 'США',
    prefix: '+1',
    mask: '(***) ***-****',
  },
  {
    key: 'by',
    name: 'Беларусь',
    prefix: '+375',
    mask: '** ***-**-**',
  },
];
