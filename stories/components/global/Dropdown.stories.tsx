import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Dropdown,
  DropdownProps,
} from '../../../src';

export default {
  title: 'Components/Global/Dropdown',
  component: Dropdown,
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

const Template: Story<DropdownProps> = ({ ...args }) => (
  <Dropdown/>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const _KitchenSink = Template.bind({});

_KitchenSink.args = {
  size: 'md'
};
