import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import PhoneInput from './PhoneInput';
import { TEST_MASKS } from './__fixtures__/masks';
import { PhoneInputProps, PhoneInputStatus } from './types';

const getDigitFieldLabel = (position: number) => `Позиция ${position} в номере`;

const getDigitField = (position: number) => screen.getByLabelText(getDigitFieldLabel(position));

const flushAnimationFrame = async () => {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
};

const renderPhoneInput = (props: Partial<PhoneInputProps> = {}) => {
  const defaultProps: PhoneInputProps = {
    masks: TEST_MASKS,
    onChange: jest.fn(),
    ...props,
  };

  return {
    user: userEvent.setup(),
    ...render(<PhoneInput {...defaultProps} />),
  };
};

describe('PhoneInput', () => {
  it('рендерит префикс и поля для цифр', () => {
    renderPhoneInput();

    expect(screen.getByRole('button', { name: /\+7/ })).toBeInTheDocument();
    expect(getDigitField(1)).toBeInTheDocument();
    expect(getDigitField(10)).toBeInTheDocument();
  });

  it('создаёт пустые поля цифр по умолчанию', () => {
    renderPhoneInput();

    for (let index = 1; index <= 10; index += 1) {
      expect(getDigitField(index)).toHaveValue('');
    }
  });

  it('вызывает onChange при вводе цифры', async () => {
    const onChange = jest.fn();
    const { user } = renderPhoneInput({ onChange });

    await user.type(getDigitField(1), '9');

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)?.[0] as string).toBe('+7(9**) ***-**-**');
  });

  it('меняет регион через выпадающий список', async () => {
    const onChange = jest.fn();
    const { user } = renderPhoneInput({ onChange });

    await user.click(screen.getByRole('button', { name: /Россия \+7/ }));

    const usOption = await screen.findByRole('option', { name: /США/ });

    await user.click(usOption);

    expect(onChange).toHaveBeenCalledWith('+1(***) ***-****');
  });

  it('сохраняет выбранный регион при одинаковом префиксе', async () => {
    const onChange = jest.fn();
    const { user } = renderPhoneInput({ onChange });

    await user.click(screen.getByRole('button', { name: /Россия \+7/ }));

    const kzOption = await screen.findByRole('option', { name: /Казахстан/ });

    await user.click(kzOption);

    expect(onChange).toHaveBeenCalledWith('+7(***) ***-**-**');
    expect(screen.getByAltText('Казахстан')).toBeInTheDocument();
    expect(screen.queryByAltText('Россия')).not.toBeInTheDocument();
  });

  it('отображает текст статуса для success и error', () => {
    const { rerender } = renderPhoneInput({
      initialValue: '+71234567890',
      status: PhoneInputStatus.SUCCESS,
      statusText: 'Номер телефона введен верно',
    });

    expect(screen.getByText('Номер телефона введен верно')).toBeInTheDocument();

    rerender(
      <PhoneInput
        masks={TEST_MASKS}
        initialValue="+71234567890"
        onChange={jest.fn()}
        status={PhoneInputStatus.ERROR}
        statusText="Неправильный номер телефона"
      />,
    );

    expect(screen.getByText('Неправильный номер телефона')).toBeInTheDocument();
  });

  it('не отображает текст статуса в состоянии default', () => {
    renderPhoneInput({
      status: PhoneInputStatus.DEFAULT,
      statusText: 'Скрытый статус',
    });

    expect(screen.queryByText('Скрытый статус')).not.toBeInTheDocument();
  });

  it('блокирует ввод в disabled-состоянии', () => {
    renderPhoneInput({ disabled: true, initialValue: '+7' });

    expect(screen.getByRole('button', { name: /\+7/ })).toBeDisabled();
    expect(getDigitField(1)).toBeDisabled();
  });

  it('инициализирует цифры из initialValue', () => {
    renderPhoneInput({ initialValue: '+7(9**) ***-**-**' });

    expect(getDigitField(1)).toHaveValue('9');
  });

  describe('клавиатурная навигация', () => {
    it('перемещает фокус стрелками между полями цифр', async () => {
      const { user } = renderPhoneInput();

      const digit1 = getDigitField(1);
      const digit2 = getDigitField(2);

      await user.click(digit1);
      await user.keyboard('{ArrowRight}');

      expect(digit2).toHaveFocus();

      await user.keyboard('{ArrowLeft}');

      expect(digit1).toHaveFocus();
    });

    it('переключает регион через клавиатуру', async () => {
      const onChange = jest.fn();
      const { user } = renderPhoneInput({ onChange });

      screen.getByRole('button', { name: /\+7/ }).focus();

      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');

      expect(onChange).toHaveBeenCalledWith('+1(***) ***-****');
    });

    it('перемещает фокус Tab между дропдауном и полями цифр', async () => {
      const { user } = renderPhoneInput();

      const regionButton = screen.getByRole('button', { name: /\+7/ });
      const digit1 = getDigitField(1);
      const digit2 = getDigitField(2);

      regionButton.focus();
      await user.tab();

      expect(digit1).toHaveFocus();

      await user.tab();

      expect(digit2).toHaveFocus();

      await user.tab({ shift: true });

      expect(digit1).toHaveFocus();

      digit1.focus();
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      await flushAnimationFrame();

      expect(regionButton).toHaveFocus();
    });

    it('перемещает фокус Tab с последней цифры на дропдаун следующего телефона', async () => {
      const user = userEvent.setup();

      render(
        <>
          <div data-testid="first-phone">
            <PhoneInput masks={TEST_MASKS} onChange={jest.fn()} />
          </div>
          <div data-testid="second-phone">
            <PhoneInput masks={TEST_MASKS} onChange={jest.fn()} />
          </div>
        </>,
      );

      const firstPhone = screen.getByTestId('first-phone');
      const secondPhone = screen.getByTestId('second-phone');
      const lastDigit = within(firstPhone).getByLabelText(getDigitFieldLabel(10));
      const secondRegionButton = within(secondPhone).getByRole('button', { name: /\+7/ });

      lastDigit.focus();
      await user.tab();
      await flushAnimationFrame();

      expect(secondRegionButton).toHaveFocus();
    });
  });

  describe('очистка Backspace', () => {
    it('очищает текущую цифру', async () => {
      const onChange = jest.fn();
      const { user } = renderPhoneInput({ onChange });

      const digit1 = getDigitField(1);

      await user.type(digit1, '9');
      await user.keyboard('{Backspace}');

      expect(digit1).toHaveValue('');
      expect(onChange.mock.calls.at(-1)?.[0]).toBe('+7(***) ***-**-**');
    });

    it('переходит на предыдущую цифру и очищает её в пустом поле', async () => {
      const onChange = jest.fn();
      const { user } = renderPhoneInput({ onChange });

      const digit1 = getDigitField(1);
      const digit2 = getDigitField(2);

      await user.type(digit1, '9');
      expect(digit2).toHaveFocus();

      await user.keyboard('{Backspace}');

      expect(digit1).toHaveValue('');
      expect(digit1).toHaveFocus();
      expect(onChange.mock.calls.at(-1)?.[0]).toBe('+7(***) ***-**-**');
      expect(digit2).toHaveValue('');
    });
  });

  describe('вставка', () => {
    it('заполняет цифры из буфера обмена', async () => {
      const onChange = jest.fn();
      const { user } = renderPhoneInput({ onChange });

      await user.click(getDigitField(1));
      await user.paste('9123456789');

      expect(onChange).toHaveBeenCalledWith('+7(912) 345-67-89');
      expect(getDigitField(1)).toHaveValue('9');
      expect(getDigitField(10)).toHaveValue('9');
    });

    it('игнорирует нецифровые символы при вставке', async () => {
      const onChange = jest.fn();
      const { user } = renderPhoneInput({ onChange });

      await user.click(getDigitField(1));
      await user.paste('(912) 345-67-89');

      expect(onChange).toHaveBeenCalledWith('+7(912) 345-67-89');
    });

    it('отбрасывает префикс страны при вставке полного номера', async () => {
      const onChange = jest.fn();
      const { user } = renderPhoneInput({ onChange });

      await user.click(getDigitField(1));
      await user.paste('+7(912) 345-67-89');

      expect(onChange).toHaveBeenCalledWith('+7(912) 345-67-89');
      expect(getDigitField(1)).toHaveValue('9');
      expect(getDigitField(2)).toHaveValue('1');
    });

    it('отбрасывает префикс +375 при вставке полного номера', async () => {
      const onChange = jest.fn();
      const { user } = renderPhoneInput({ onChange });

      await user.click(getDigitField(1));
      await user.paste('+375 29 123-45-67');

      expect(screen.getByAltText('Беларусь')).toBeInTheDocument();
      expect(onChange).toHaveBeenCalledWith('+37529 123-45-67');
      expect(screen.getByLabelText('Позиция 1 в номере')).toHaveValue('2');
      expect(screen.getByLabelText('Позиция 2 в номере')).toHaveValue('9');
    });

    it('отбрасывает префикс +1 при вставке полного номера', async () => {
      const onChange = jest.fn();
      const { user } = renderPhoneInput({ onChange });

      await user.click(getDigitField(1));
      await user.paste('+1(555) 123-4567');

      expect(screen.getByAltText('США')).toBeInTheDocument();
      expect(onChange).toHaveBeenCalledWith('+1(555) 123-4567');
      expect(screen.getByLabelText('Позиция 1 в номере')).toHaveValue('5');
      expect(screen.getByLabelText('Позиция 2 в номере')).toHaveValue('5');
    });

    it('сохраняет выбранный регион при вставке номера с тем же префиксом', async () => {
      const onChange = jest.fn();
      const { user } = renderPhoneInput({ onChange });

      await user.click(screen.getByRole('button', { name: /Россия \+7/ }));
      await user.click(await screen.findByRole('option', { name: /Казахстан/ }));

      await user.click(screen.getByLabelText('Позиция 1 в номере'));
      await user.paste('+7(700) 123-45-67');

      expect(screen.getByAltText('Казахстан')).toBeInTheDocument();
      expect(onChange).toHaveBeenCalledWith('+7(700) 123-45-67');
    });

    it('отбрасывает префикс с пробелами при вставке', async () => {
      const onChange = jest.fn();
      const { user } = renderPhoneInput({ onChange });

      await user.click(getDigitField(1));
      await user.paste('+ 7(912) 345-67-89');

      expect(onChange).toHaveBeenCalledWith('+7(912) 345-67-89');
      expect(getDigitField(1)).toHaveValue('9');
    });
  });
});
