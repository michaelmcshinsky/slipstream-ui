import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Center as CenterComponent, CenterProps, Text } from '../..';

export default {
  title: 'Components/Layout/Center',
  component: CenterComponent,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<CenterProps> = ({ ...args }) => (
  <CenterComponent className="p-4 bg-green-200" {...args}>
    <Text>Centered Item</Text>
  </CenterComponent>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Center = Template.bind({});

Center.args = {};
