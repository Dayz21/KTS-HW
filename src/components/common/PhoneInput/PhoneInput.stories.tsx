import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import PhoneInput from './PhoneInput';
import { TEST_MASKS } from './__fixtures__/masks';
import { PhoneInputProps, PhoneInputStatus } from './types';

const meta: Meta<typeof PhoneInput> = {
  title: 'Components/PhoneInput',
  component: PhoneInput,
  args: {
    masks: TEST_MASKS,
  },
};

export default meta;

type Story = StoryObj<typeof PhoneInput>;

const InteractivePhoneInput = (args: PhoneInputProps) => {
  const [value, setValue] = React.useState('');

  return <PhoneInput {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: (args) => <InteractivePhoneInput {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: '+7',
  },
};

export const Success: Story = {
  args: {
    value: '+71234567890',
    status: PhoneInputStatus.SUCCESS,
    statusText: 'Номер телефона введен верно',
  },
};

export const Error: Story = {
  args: {
    value: '+71234567890',
    status: PhoneInputStatus.ERROR,
    statusText: 'Неправильный номер телефона',
  },
};

export const WithValue: Story = {
  args: {
    value: '+71234567890',
  },
};
