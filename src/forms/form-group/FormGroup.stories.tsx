import React from 'react';
import { Meta, Story } from '@storybook/react';
import { FormGroup as FormGroupComponent, TFormGroup } from './FormGroup';
import { Label } from '../label';
import { Input } from '../input';

export default {
  title: 'Components/Forms',
  component: FormGroupComponent,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TFormGroup> = ({ ...args }) => (
  <FormGroupComponent {...args}>
    <Label>Label</Label>
    <Input />
  </FormGroupComponent>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const FormGroup = Template.bind({});

FormGroup.args = {};
