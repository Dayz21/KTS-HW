import { MaskPart, PhoneMask } from './types';

const MASK_DIGIT_PLACEHOLDER = '*';

const createEmptyDigits = (length: number): string[] => Array.from({ length }, () => '');

const extractDigits = (value: string): string => value.replace(/\D/g, '');

export const normalizePhoneNumber = (phone: string) => {
  return phone.replace(/[^0-9+]/g, '');
};

/** Среди масок с одинаковым префиксом берём самую длинную (+7 vs +375). */
export const findMaskByPrefix = (masks: PhoneMask[], phone: string): PhoneMask | undefined => {
  const normalizedPhone = normalizePhoneNumber(phone);

  return masks
    .filter((mask) => normalizedPhone.startsWith(mask.prefix))
    .sort((a, b) => b.prefix.length - a.prefix.length)[0];
};

export const resolveMask = (
  masks: PhoneMask[],
  lookupValue: string,
  preferredMaskKey?: string | null,
): PhoneMask => {
  if (preferredMaskKey) {
    const preferred = masks.find(
      (mask) => mask.key === preferredMaskKey && lookupValue.startsWith(mask.prefix),
    );

    if (preferred) {
      return preferred;
    }
  }

  return findMaskByPrefix(masks, lookupValue) ?? masks[0];
};

export const getMaskDigitCount = (mask: string): number => {
  return [...mask].filter((char) => char === MASK_DIGIT_PLACEHOLDER).length;
};

export const parseMaskParts = (mask: string): MaskPart[] => {
  const parts: MaskPart[] = [];
  let digitIndex = 0;
  let position = 0;

  while (position < mask.length) {
    if (mask[position] === MASK_DIGIT_PLACEHOLDER) {
      parts.push({ type: 'digit', index: digitIndex });
      digitIndex += 1;
      position += 1;
      continue;
    }

    let staticValue = '';

    while (position < mask.length && mask[position] !== MASK_DIGIT_PLACEHOLDER) {
      staticValue += mask[position];
      position += 1;
    }

    parts.push({ type: 'static', value: staticValue });
  }

  return parts;
};

export const extractMaskDigits = (prefix: string, mask: string, value: string): string[] => {
  const digitCount = getMaskDigitCount(mask);
  const parts = parseMaskParts(mask);

  if (!value.startsWith(prefix)) {
    return createEmptyDigits(digitCount);
  }

  let valueIndex = prefix.length;
  const digits: string[] = [];

  for (const part of parts) {
    if (part.type === 'static') {
      valueIndex += part.value.length;
      continue;
    }

    const char = value[valueIndex];

    valueIndex += 1;

    if (char && /\d/.test(char)) {
      digits.push(char);
    } else {
      digits.push('');
    }
  }

  return digits;
};

export const formatPhoneValue = (prefix: string, mask: string, digits: string[]): string => {
  const parts = parseMaskParts(mask);
  let result = prefix;
  let digitIndex = 0;

  for (const part of parts) {
    if (part.type === 'static') {
      result += part.value;
    } else {
      result += digits[digitIndex] || MASK_DIGIT_PLACEHOLDER;
      digitIndex += 1;
    }
  }

  return result;
};

export const formatPhoneTemplate = (prefix: string, mask: string): string => {
  const digitCount = getMaskDigitCount(mask);

  return formatPhoneValue(prefix, mask, createEmptyDigits(digitCount));
};

export const hasInternationalPrefix = (pastedText: string): boolean => {
  const trimmed = pastedText.trim();

  return trimmed.startsWith('+');
};

/** Определяет маску по вставленному номеру; при том же префиксе сохраняет текущий регион. */
export const resolveMaskFromPaste = (
  masks: PhoneMask[],
  pastedText: string,
  currentMaskKey?: string | null,
): PhoneMask => {
  const trimmed = pastedText.trim();
  const normalizedPhone = normalizePhoneNumber(trimmed);
  const lookupValue = normalizedPhone.startsWith('+') ? normalizedPhone : `+${normalizedPhone}`;
  const detectedMask = findMaskByPrefix(masks, lookupValue);

  if (!detectedMask || masks.length === 0) {
    return resolveMask(masks, lookupValue, currentMaskKey);
  }

  if (!hasInternationalPrefix(trimmed)) {
    return resolveMask(masks, lookupValue, currentMaskKey);
  }

  const currentMask = currentMaskKey
    ? masks.find((mask) => mask.key === currentMaskKey)
    : undefined;

  if (currentMask?.prefix === detectedMask.prefix) {
    return currentMask;
  }

  return detectedMask;
};

/** Извлекает цифры маски из вставленного текста, отбрасывая префикс страны. */
export const extractPastedMaskDigits = (
  prefix: string,
  mask: string,
  pastedText: string,
): string => {
  const trimmed = pastedText.trim();

  if (!trimmed) {
    return '';
  }

  const maskDigitCount = getMaskDigitCount(mask);
  const allDigits = extractDigits(trimmed);
  const prefixDigits = prefix.slice(1);
  const normalizedPasted = normalizePhoneNumber(trimmed);

  if (allDigits.startsWith(prefixDigits) && normalizedPasted.startsWith(prefix)) {
    return allDigits.slice(prefixDigits.length, prefixDigits.length + maskDigitCount);
  }

  if (trimmed.startsWith(prefix) && hasMaskStructure(prefix, trimmed)) {
    return extractMaskDigits(prefix, mask, trimmed).join('').slice(0, maskDigitCount);
  }

  return allDigits.slice(0, maskDigitCount);
};

export const hasMaskStructure = (prefix: string, value: string): boolean => {
  if (!value.startsWith(prefix)) {
    return false;
  }

  if (value.includes(MASK_DIGIT_PLACEHOLDER)) {
    return true;
  }

  const afterPrefix = value.slice(prefix.length);

  return afterPrefix.length > 0 && /[^\d]/.test(afterPrefix);
};

/** Превращает любой номер в значение по маске; незаполненные позиции — *. */
export const normalizePhoneInput = (
  masks: PhoneMask[],
  phone: string,
  preferredMaskKey?: string | null,
): string => {
  if (!phone || masks.length === 0) {
    return '';
  }

  const trimmed = phone.trim();
  const normalizedPhone = normalizePhoneNumber(trimmed);
  const lookupValue = normalizedPhone.startsWith('+') ? normalizedPhone : `+${normalizedPhone}`;
  const mask = resolveMask(masks, lookupValue, preferredMaskKey);

  if (lookupValue === mask.prefix) {
    return formatPhoneTemplate(mask.prefix, mask.mask);
  }

  const formattedSource = trimmed.startsWith(mask.prefix) ? trimmed : lookupValue;

  if (hasMaskStructure(mask.prefix, formattedSource)) {
    const digits = extractMaskDigits(mask.prefix, mask.mask, formattedSource);

    return formatPhoneValue(mask.prefix, mask.mask, digits);
  }

  const prefixDigits = mask.prefix.slice(1);
  const allDigits = extractDigits(trimmed);
  const maskDigitCount = getMaskDigitCount(mask.mask);

  const afterPrefix = allDigits.startsWith(prefixDigits)
    ? allDigits.slice(prefixDigits.length, prefixDigits.length + maskDigitCount)
    : allDigits.slice(0, maskDigitCount);

  const digits = Array.from({ length: maskDigitCount }, (_, index) => afterPrefix[index] ?? '');

  return formatPhoneValue(mask.prefix, mask.mask, digits);
};

/** Twemoji PNG: Unicode-флаги на Windows показываются как буквы (RU, US). */
export const getFlagEmojiUrl = (countryKey: string): string => {
  const codePoints = [...countryKey.toLowerCase()]
    .map((char) => (0x1f1e6 - 97 + char.charCodeAt(0)).toString(16))
    .join('-');

  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${codePoints}.png`;
};
