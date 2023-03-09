import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Switch as SwitchComponent, TSwitch } from './Switch';

export default {
  title: 'Components/Forms',
  component: SwitchComponent,
  argTypes: {
    color: {
      control: {
        type: 'select',
        options: [
          'slate',
          'gray',
          'zinc',
          'neutral',
          'stone',
          'red',
          'orange',
          'amber',
          'yellow',
          'lime',
          'green',
          'emerald',
          'teal',
          'cyan',
          'sky',
          'blue',
          'indigo',
          'violet',
          'purple',
          'fuchsia',
          'pink',
          'rose',
        ],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TSwitch> = ({ text, ...args }) => (
  <SwitchComponent {...args} />
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Switch = Template.bind({});

Switch.args = {};
