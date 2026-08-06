import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import PhoneInput from './PhoneInput';
import { TEST_MASKS } from './__fixtures__/masks';
import { PhoneInputStatus } from './types';

const STATUS_OPTIONS = Object.values(PhoneInputStatus);

const meta: Meta<typeof PhoneInput> = {
  title: 'Components/PhoneInput',
  component: PhoneInput,
  args: {
    masks: TEST_MASKS,
    initialValue: '',
    onChange: () => {},
  },
  argTypes: {
    masks: {
      control: false,
      table: { disable: true },
    },
    className: {
      control: false,
      table: { disable: true },
    },
    onChange: {
      action: 'change',
      table: { disable: true },
    },
    status: {
      control: 'select',
      options: STATUS_OPTIONS,
    },
    initialValue: {
      control: 'text',
    },
  },
  render: (args) => <PhoneInput key={args.initialValue} {...args} />,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    initialValue: '+7',
  },
};

export const Success: Story = {
  args: {
    initialValue: '+71234567890',
    status: PhoneInputStatus.SUCCESS,
    statusText: 'Номер телефона введен верно',
  },
};

export const Error: Story = {
  args: {
    initialValue: '+71234567890',
    status: PhoneInputStatus.ERROR,
    statusText: 'Неправильный номер телефона',
  },
};

export const WithValue: Story = {
  args: {
    initialValue: '+71234567890',
  },
};
