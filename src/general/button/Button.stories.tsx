import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Button, ButtonProps } from './Button';

export default {
  title: 'Components/Forms/Button',
  component: Button,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg'],
      },
    },
    type: {
      control: {
        type: 'select',
        options: ['button', 'submit', 'reset'],
      },
    },
    color: {
      control: {
        type: 'select',
        options: ['primary', 'default', 'link', 'success', 'warning', 'danger'],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<ButtonProps> = args => <Button href="/" {...args}>Submit</Button>;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const KitchenSink = Template.bind({});

KitchenSink.args = {
  size: 'md',
  type: 'button',
  color: 'primary',
  tag: 'a',
};

export const Disabled = Template.bind({});

Disabled.args = {
  disabled: true,
};
