import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Button, ButtonProps } from '../../src/forms/Button';

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
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<ButtonProps> = args => <Button {...args}>Submit</Button>;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
  size: 'md',
  type: 'button',
};

export const Disabled = Template.bind({});

Disabled.args = {
  size: 'md',
  type: 'button',
  disabled: true
};
