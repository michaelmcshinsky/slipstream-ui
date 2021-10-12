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
  <>
    <DropdownCompnent {...args} className="mt-32 ml-32">
      <DropdownCompnent.Toggle tag={Button}>Click Me</DropdownCompnent.Toggle>
      <DropdownCompnent.Menu>
        <DropdownCompnent.Item>Profile</DropdownCompnent.Item>
        <DropdownCompnent.Item>Login</DropdownCompnent.Item>
        <DropdownCompnent.Item>Logout</DropdownCompnent.Item>
      </DropdownCompnent.Menu>
    </DropdownCompnent>
    <div className="relative mt-8 p-32 bg-gray-200 border border-solid border-gray-400 flex items-center justify-center">
      Z-index of dropdown higher than this container
    </div>
  </>
);
