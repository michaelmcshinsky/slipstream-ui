import React from 'react';
import { Meta, Story } from '@storybook/react';
import { TabSet as TabSetComponent, TabSetProps, TabItem } from '../../src';

export default {
  title: 'Components/Navigation',
  component: TabSetComponent,
  argTypes: {
    tag: {
      control: {
        type: 'select',
        options: ['nav', 'ul', 'div'],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TabSetProps> = ({ ...args }) => (
  <TabSetComponent {...args}>
    <TabItem>Home</TabItem>
    <TabItem>About</TabItem>
    <TabItem>Projects</TabItem>
    <TabItem>Contact</TabItem>
  </TabSetComponent>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const TabSet = Template.bind({});

TabSet.args = {
};
