import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import {
  TabSet as TabSetComponent,
  TabSetProps,
  TabItem,
  SlipstreamProvider,
} from '../../';

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

const Template: Story<TabSetProps> = ({ ...args }) => {
  const [active, setActive] = useState('1');

  function _handleChange(value: any) {
    console.log('value', value);
    setActive(value);
  }

  return (
    <SlipstreamProvider dark>
      <TabSetComponent {...args} active={active} onClick={_handleChange}>
        <TabSetComponent.Item value="1">
          Home
        </TabSetComponent.Item>
        <TabSetComponent.Item value="2">About</TabSetComponent.Item>
        <TabSetComponent.Item value="3" active>Projects</TabSetComponent.Item>
        <TabSetComponent.Item value="4">Contact</TabSetComponent.Item>
      </TabSetComponent>
    </SlipstreamProvider>
  );
};
// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const TabSet = Template.bind({});

TabSet.args = {};
