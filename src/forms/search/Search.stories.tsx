import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Search as SearchComponent, TSearch } from './Search';

export default {
  title: 'Components/Forms',
  component: SearchComponent,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TSearch> = args => <SearchComponent {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Search = Template.bind({});

Search.args = {};
