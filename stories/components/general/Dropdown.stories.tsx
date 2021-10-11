import React from 'react';
import { Meta } from '@storybook/react';
import {
  Dropdown as DropdownCompnent,
  DropdownProps,
  Button,
} from '../../../src';

export default {
  title: 'Components/General/Dropdown',
  component: DropdownCompnent,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg'],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

export const Dropdown = (args: DropdownProps) => (
  <DropdownCompnent {...args} className="m-32">
    <DropdownCompnent.Toggle tag={Button}>Click Me</DropdownCompnent.Toggle>
    <DropdownCompnent.Menu>
      <DropdownCompnent.Item>Profile</DropdownCompnent.Item>
      <DropdownCompnent.Item>Login</DropdownCompnent.Item>
      <DropdownCompnent.Item>Logout</DropdownCompnent.Item>
    </DropdownCompnent.Menu>
  </DropdownCompnent>
);
