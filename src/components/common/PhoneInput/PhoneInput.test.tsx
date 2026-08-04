import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import PhoneInput from './PhoneInput';
import { TEST_MASKS } from './__fixtures__/masks';
import { PhoneInputProps, PhoneInputStatus } from './types';

const renderPhoneInput = (props: Partial<PhoneInputProps> = {}) => {
  const defaultProps: PhoneInputProps = {
    masks: TEST_MASKS,
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
    expect(screen.getByLabelText('Цифра 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Цифра 10')).toBeInTheDocument();
  });

  it('вызывает onChange при вводе цифры', async () => {
    const onChange = jest.fn();
    const { user } = renderPhoneInput({ onChange });

    await user.type(screen.getByLabelText('Цифра 1'), '9');

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)?.[0] as string).toBe('+7(9**) ***-**-**');
  });

  it('меняет регион через выпадающий список', async () => {
    const onChange = jest.fn();
    const { user } = renderPhoneInput({ onChange });

    await user.click(screen.getByRole('button', { name: /Россия \+7/ }));

    const usOption = await screen.findByRole('option', { name: /США/ });

    fireEvent.click(usOption);

    expect(onChange).toHaveBeenCalledWith('+1(***) ***-****');
  });

  it('отображает текст статуса для success и error', () => {
    const { rerender } = renderPhoneInput({
      value: '+71234567890',
      status: PhoneInputStatus.SUCCESS,
      statusText: 'Номер телефона введен верно',
    });

    expect(screen.getByText('Номер телефона введен верно')).toBeInTheDocument();

    rerender(
      <PhoneInput
        masks={TEST_MASKS}
        value="+71234567890"
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
    renderPhoneInput({ disabled: true, value: '+7' });

    expect(screen.getByRole('button', { name: /\+7/ })).toBeDisabled();
    expect(screen.getByLabelText('Цифра 1')).toBeDisabled();
  });

  it('обновляет цифры при изменении контролируемого value', async () => {
    const ControlledWrapper = () => {
      const [value, setValue] = React.useState('+7(9**) ***-**-**');

      return (
        <>
          <button type="button" onClick={() => setValue('+7(1**) ***-**-**')}>
            Обновить
          </button>
          <PhoneInput masks={TEST_MASKS} value={value} />
        </>
      );
    };

    const user = userEvent.setup();

    render(<ControlledWrapper />);

    expect(screen.getByLabelText('Цифра 1')).toHaveValue('9');

    await user.click(screen.getByRole('button', { name: 'Обновить' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Цифра 1')).toHaveValue('1');
    });
  });
});
