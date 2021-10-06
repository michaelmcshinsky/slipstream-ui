import React from 'react';
import { Meta, Story } from '@storybook/react';
import { TabItem as TabItemComponent, TabItemProps } from '../../src';

export default {
  title: 'Components/Navigation',
  component: TabItemComponent,
  argTypes: {
    tag: {
      control: {
        type: 'select',
        options: ['li', 'a', 'div', 'input'],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TabItemProps> = ({ ...args }) => (
  <>
    <TabItem>This is a tab item</TabItem>
  </>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const TabItem = Template.bind({});

TabItem.args = {
};
