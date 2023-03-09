import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SlipstreamProvider } from '../../';
import { Alert, TAlert } from './Alert';

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
          'white',
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

const Template: Story<TAlert> = ({
  children,
  size,
  color,
  ...args
}) => (
  <SlipstreamProvider>
  <Alert {...args} size={size} color={color}>
    {children}
  </Alert>
  </SlipstreamProvider>
);

export const Default = Template.bind({});

Default.args = {
  children: 'First name is required...',
};

export const WithButton = Template.bind({});

WithButton.args = {
  children: 'Button, button, who has the button...',
  color: 'yellow',
  onClick: () => {
    console.log('test');
  },
};
