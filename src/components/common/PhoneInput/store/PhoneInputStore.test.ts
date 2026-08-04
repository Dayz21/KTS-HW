import { TEST_MASKS } from '../__fixtures__/masks';

import { PhoneInputStore } from './PhoneInputStore';

describe('PhoneInputStore', () => {
  it('инициализируется с нормализованным значением', () => {
    const store = new PhoneInputStore({
      masks: TEST_MASKS,
      value: '+7123',
    });

    expect(store.normalizedValue).toBe('+7(123) ***-**-**');
  });

  it('инициализируется с пустым значением и выбирает первую маску', () => {
    const store = new PhoneInputStore({
      masks: TEST_MASKS,
      value: '',
    });

    expect(store.normalizedValue).toBe('');
    expect(store.selectedMask?.key).toBe('ru');
  });

  it('выбирает маску по длинному префиксу', () => {
    const store = new PhoneInputStore({
      masks: TEST_MASKS,
      value: '+375291234567',
    });

    expect(store.selectedMask?.key).toBe('by');
  });

  it('сбрасывает значение при смене региона', () => {
    const onChange = jest.fn();
    const store = new PhoneInputStore({
      masks: TEST_MASKS,
      value: '+71234567890',
      onChange,
    });

    store.changeRegion(TEST_MASKS[2]);

    expect(store.normalizedValue).toBe('+1(***) ***-****');
    expect(onChange).toHaveBeenCalledWith('+1(***) ***-****');
  });

  it('обновляет цифры и вызывает onChange', () => {
    const onChange = jest.fn();
    const store = new PhoneInputStore({
      masks: TEST_MASKS,
      value: '+7(***) ***-**-**',
      onChange,
    });

    store.setDigits(['9', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

    expect(store.normalizedValue).toBe('+7(912) 345-67-89');
    expect(onChange).toHaveBeenCalledWith('+7(912) 345-67-89');
  });

  it('синхронизирует value без вызова onChange', () => {
    const onChange = jest.fn();
    const store = new PhoneInputStore({
      masks: TEST_MASKS,
      value: '+7(***) ***-**-**',
      onChange,
    });

    store.syncValue('+79876543210');

    expect(store.normalizedValue).toBe('+7(987) 654-32-10');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('сохраняет выбранную маску при одинаковом префиксе', () => {
    const kzMask = TEST_MASKS.find((mask) => mask.key === 'kz');

    expect(kzMask).toBeDefined();

    const store = new PhoneInputStore({
      masks: TEST_MASKS,
      value: '+7(***) ***-**-**',
    });

    store.changeRegion(kzMask!);

    expect(store.selectedMask?.key).toBe('kz');
    expect(store.normalizedValue).toBe('+7(***) ***-**-**');
  });

  it('сохраняет выбранную маску при вводе цифр с одинаковым префиксом', () => {
    const kzMask = TEST_MASKS.find((mask) => mask.key === 'kz');

    expect(kzMask).toBeDefined();

    const onChange = jest.fn();
    const store = new PhoneInputStore({
      masks: TEST_MASKS,
      value: '+7(***) ***-**-**',
      onChange,
    });

    store.changeRegion(kzMask!);
    store.setDigits(['7', '0', '0', '1', '2', '3', '4', '5', '6', '7']);

    expect(store.selectedMask?.key).toBe('kz');
    expect(store.normalizedValue).toBe('+7(700) 123-45-67');
    expect(onChange).toHaveBeenCalledWith('+7(700) 123-45-67');
  });

  it('возвращает null selectedMask и пустые digits при пустом списке масок', () => {
    const store = new PhoneInputStore({
      masks: [],
      value: '+7',
    });

    expect(store.selectedMask).toBeNull();
    expect(store.digits).toEqual([]);
  });
});
