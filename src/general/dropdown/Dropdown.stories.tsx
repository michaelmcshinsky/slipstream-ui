import React from 'react';
import { Meta } from '@storybook/react';
import { Dropdown as DropdownCompnent, DropdownProps } from './Dropdown';
import { Button } from '../button';

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
    <div className="relative flex items-center justify-center p-32 mt-8 bg-gray-200 border border-gray-400 border-solid">
      Z-index of dropdown higher than this container
    </div>
  </>
);
