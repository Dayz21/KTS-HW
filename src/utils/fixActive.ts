/**
 * Фикс для корректной работы :active на touch-устройствах (iOS).
 */
export const fixActive = (): void => {
  document.addEventListener('touchstart', () => {}, { passive: true });
};
