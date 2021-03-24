import React from 'react';
import { Meta, Story } from '@storybook/react';
import { CardTitle, CardTitleProps } from '../../src';

export default {
  title: 'Components/Global/CardTitle',
  component: CardTitle,
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

const Template: Story<CardTitleProps> = ({ text, ...args }) => (
  <CardTitle {...args}>{text}</CardTitle>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
  text: 'Card Title',
};
