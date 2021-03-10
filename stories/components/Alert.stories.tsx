import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Alert, AlertProps } from '../../src/extra/Alert';

export default {
  title: 'Components/Extra/Alert',
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
  text,
  size,
  color,
  ...args
}) => (
  <Alert size={size} color={color} {...args}>
    {text}
  </Alert>
);

export const Default = Template.bind({});

Default.args = {
  text: 'First name is required...',
};

export const WithButton = Template.bind({});

WithButton.args = {
  text: 'Button, button, who has the button...',
  color: 'yellow',
  size: 'md',
  onClick: () => {},
};
