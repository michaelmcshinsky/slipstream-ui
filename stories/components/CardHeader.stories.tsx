import React from 'react';
import { Meta, Story } from '@storybook/react';
import { CardHeader, CardHeaderProps, CardTitle } from '../../src';

export default {
  title: 'Components/Global/CardHeader',
  component: CardHeader,
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

const Template: Story<CardHeaderProps> = ({ text, ...args }) => (
  <CardHeader {...args}><CardTitle>{text}</CardTitle></CardHeader>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
  text: 'Card Header with Title'
};
