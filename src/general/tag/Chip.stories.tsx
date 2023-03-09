import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Chip, TChip } from './';

export default {
  title: 'Components/General/Chip',
  component: Chip,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TChip> = ({ ...args }) => <Chip {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const _KitchenSink = Template.bind({});

_KitchenSink.args = {
  children: 'Chip Text',
};
