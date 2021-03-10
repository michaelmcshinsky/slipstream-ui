import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Select, SelectProps } from '../../src/forms/Select';

export default {
  title: 'Components/Forms/Select',
  component: Select,
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

const Template: Story<SelectProps> = args => <Select {...args} >
  <option value="alpha">Alpha</option>
  <option value="bravo">Bravo</option>
  <option value="charlie">Charlie</option>
  <option value="delta">Delta</option>
  <option value="echo">Echo</option>
  <option value="foxtrot">Foxtrot</option>
</Select>;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
  size: 'md',
};
