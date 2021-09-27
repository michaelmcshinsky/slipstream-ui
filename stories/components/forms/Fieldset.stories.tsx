import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  FieldSet as FieldSetComponent,
  FieldSetProps,
  FieldSetLegend,
  FormGroup,
  Label,
  Input,
} from '../../../src';

export default {
  title: 'Components/Forms',
  component: FieldSetComponent,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<FieldSetProps> = ({ children, ...args }) => (
  <FieldSetComponent {...args}>
    <FieldSetLegend>I am Legend</FieldSetLegend>
    <FormGroup>
      <Label>I am Label</Label>
      <Input placeholder="I am Placeholder" />
    </FormGroup>
  </FieldSetComponent>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const FieldSet = Template.bind({});

FieldSet.args = {};
