const TABBABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const isTabbable = (element: HTMLElement): boolean => {
  if (element.tabIndex < 0) {
    return false;
  }

  if (element.getAttribute('aria-hidden') === 'true') {
    return false;
  }

  return element.matches(TABBABLE_SELECTOR) && element.getClientRects().length > 0;
};

const getTabbableElements = (root: ParentNode = document): HTMLElement[] => {
  return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter(isTabbable);
};

export const focusNextElement = (current: HTMLElement): void => {
  const tabbable = getTabbableElements();
  const index = tabbable.indexOf(current);

  if (index !== -1 && index < tabbable.length - 1) {
    tabbable[index + 1].focus();
  }
};

export const focusPreviousElement = (current: HTMLElement): void => {
  const tabbable = getTabbableElements();
  const index = tabbable.indexOf(current);

  if (index > 0) {
    tabbable[index - 1].focus();
  }
};
