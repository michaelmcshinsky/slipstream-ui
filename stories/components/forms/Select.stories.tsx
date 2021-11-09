import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Select as SelectComponent, SelectProps } from '../../../src';

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
  <SelectComponent.OptionGroup label="Military Alphabet">
    <SelectComponent.Option value="alpha">Alpha</SelectComponent.Option>
    <SelectComponent.Option value="bravo">Bravo</SelectComponent.Option>
    <SelectComponent.Option value="charlie">Charlie</SelectComponent.Option>
    <SelectComponent.Option value="delta">Delta</SelectComponent.Option>
    <SelectComponent.Option value="echo">Echo</SelectComponent.Option>
    <SelectComponent.Option value="foxtrot">Foxtrot</SelectComponent.Option>
  </SelectComponent.OptionGroup>
</SelectComponent>;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Select = Template.bind({});

Select.args = {
  size: 'md',
};
