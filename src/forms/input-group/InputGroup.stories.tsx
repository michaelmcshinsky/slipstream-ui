import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  InputGroup as InputGroupComponent,
  TInputGroup,
  SlipstreamProvider,
} from '../../';
import { Input } from '../input';

export default {
  title: 'Components/Forms',
  component: InputGroupComponent,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TInputGroup> = (args) => (
  <SlipstreamProvider>
    <div className="p-4">
      <InputGroupComponent {...args}>
        <InputGroupComponent.Prepend>$</InputGroupComponent.Prepend>
        <Input/>
        <InputGroupComponent.Append>%</InputGroupComponent.Append>
      </InputGroupComponent>
    </div>
  </SlipstreamProvider>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const InputGroup = Template.bind({});
