import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Select as SelectComponent, SelectOption, SelectOptionGroup, SelectProps } from '../../../src';

export default {
  title: 'Components/Forms',
  component: SelectComponent,
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

const Template: Story<SelectProps> = args => <SelectComponent {...args} >
  <SelectOptionGroup label="Military Alphabet">
    <SelectOption value="alpha">Alpha</SelectOption>
    <SelectOption value="bravo">Bravo</SelectOption>
    <SelectOption value="charlie">Charlie</SelectOption>
    <SelectOption value="delta">Delta</SelectOption>
    <SelectOption value="echo">Echo</SelectOption>
    <SelectOption value="foxtrot">Foxtrot</SelectOption>
  </SelectOptionGroup>
</SelectComponent>;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Select = Template.bind({});

Select.args = {
  size: 'md',
};
