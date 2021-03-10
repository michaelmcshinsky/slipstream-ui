import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Label, LabelProps } from '../../src/forms/Label';

export default {
  title: 'Components/Forms/Label',
  component: Label,
  argTypes: {
    text: { control: 'text' },
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

const Template: Story<LabelProps> = ({ text, ...args }) => (
  <Label {...args}>{text}</Label>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
  text: 'Label',
  size: 'md',
};
