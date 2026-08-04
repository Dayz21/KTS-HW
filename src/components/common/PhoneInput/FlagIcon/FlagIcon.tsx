import React from 'react';

import { PhoneMask } from '../types';
import { getFlagEmojiUrl } from '../utils';

import s from './FlagIcon.module.scss';

type FlagIconProps = {
  mask: PhoneMask;
};

export const FlagIcon: React.FC<FlagIconProps> = ({ mask }) => (
  <img className={s.root} src={getFlagEmojiUrl(mask.key)} alt={mask.name} draggable={false} />
);
