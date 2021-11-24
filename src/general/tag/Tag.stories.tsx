import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Tag, TagProps } from './Tag';

export default {
  title: 'Components/General/Tag',
  component: Tag,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TagProps> = ({ ...args }) => <Tag {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const _KitchenSink = Template.bind({});

_KitchenSink.args = {
  children: 'Tag Text',
};
