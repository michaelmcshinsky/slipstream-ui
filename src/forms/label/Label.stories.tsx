import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Label as LabelComponent, TLabel } from './Label';

export default {
  title: 'Components/Forms',
  component: LabelComponent,
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

const Template: Story<TLabel> = ({ text, ...args }) => (
  <LabelComponent {...args}>{text}</LabelComponent>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Label = Template.bind({});

Label.args = {
  text: 'Label',
  size: 'md',
};
