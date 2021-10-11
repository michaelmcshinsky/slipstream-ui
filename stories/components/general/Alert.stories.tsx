import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Alert, AlertProps } from '../../../src';

export default {
  title: 'Components/General/Alert',
  component: Alert,
  argTypes: {
    text: { control: 'text' },
    color: {
      control: {
        type: 'select',
        options: [
          'gray',
          'red',
          'yellow',
          'green',
          'blue',
          'indigo',
          'purple',
          'pink',
          'black',
          'white'
        ],
      },
    },
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

const Template: Story<AlertProps> = ({
  children,
  size,
  color,
  ...args
}) => (
  <Alert {...args} size={size} color={color}>
    {children}
  </Alert>
);

export const Default = Template.bind({});

Default.args = {
  children: 'First name is required...',
};

export const WithButton = Template.bind({});

WithButton.args = {
  children: 'Button, button, who has the button...',
  color: 'yellow',
  onClick: () => {},
};
