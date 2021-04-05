import React from 'react';
import { Meta, Story } from '@storybook/react';
import { CardTitle as CardTitleComponent, CardTitleProps } from '../../src';

export default {
  title: 'Components/Global/Card',
  component: CardTitleComponent,
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
  <CardTitleComponent {...args}>{text}</CardTitleComponent>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const CardTitle = Template.bind({});

CardTitle.args = {
  text: 'Card Title',
};
