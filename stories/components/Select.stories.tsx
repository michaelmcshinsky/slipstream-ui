import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Select as SelectComponent, SelectProps } from '../../src/forms/Select';

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
  <option value="alpha">Alpha</option>
  <option value="bravo">Bravo</option>
  <option value="charlie">Charlie</option>
  <option value="delta">Delta</option>
  <option value="echo">Echo</option>
  <option value="foxtrot">Foxtrot</option>
</SelectComponent>;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Select = Template.bind({});

Select.args = {
  size: 'md',
};
