import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Heading as HeadingComponent, HeadingProps } from '../../src';

export default {
  title: 'Components/Elements',
  component: HeadingComponent,
  argTypes: {
    tag: {
      control: {
        type: 'select',
        options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<HeadingProps> = ({ ...args }) => (
  <HeadingComponent {...args}>
    Heading: {args.tag.toUpperCase()}
  </HeadingComponent>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Heading = Template.bind({});

Heading.args = {
  tag: 'h1',
};