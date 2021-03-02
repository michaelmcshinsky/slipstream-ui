import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Input, InputProps } from '../src/forms/Input';
import { Label } from '../src/forms/Label';

export default {
  title: 'Components/Forms/Input',
  component: Input,
  argTypes: {
    placeholder: { control: 'text' },
    type: {
      control: {
        type: 'select',
        options: [
          "button",
          "checkbox",
          "color",
          "date",
          "datetime-local",
          "email",
          "file",
          "hidden",
          "image",
          "month",
          "number",
          "password",
          "radio",
          "range",
          "reset",
          "search",
          "submit",
          "tel",
          "text",
          "time",
          "url",
          "week",
        ],
      },
    },
    size: {
      control: {
        type: 'select',
        options: [
          "sm",
          "md",
          "lg",
        ],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<InputProps> = args => (
  <>
  <Label>Label</Label>
  <Input {...args} />
  </>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
  type: 'text',
  size: 'md',
  placeholder: 'First Name',
};
