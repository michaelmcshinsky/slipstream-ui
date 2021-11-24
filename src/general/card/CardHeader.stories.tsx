import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  CardHeader as CardHeaderComponent,
  CardHeaderProps,
} from './CardHeader';
import { CardTitle } from './CardTitle';

export default {
  title: 'Components/General/Card',
  component: CardHeaderComponent,
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

const Template: Story<CardHeaderProps> = ({ children, ...args }) => (
  <CardHeaderComponent {...args}>
    <CardTitle>{children}</CardTitle>
  </CardHeaderComponent>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const CardHeader = Template.bind({});

CardHeader.args = {
  children: 'Card Header with Title',
};
