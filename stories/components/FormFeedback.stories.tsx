import React from 'react';
import { Meta, Story } from '@storybook/react';
import { FormFeedback, FormFeedbackProps } from '../../src';

export default {
  title: 'Components/Forms/FormFeedback',
  component: FormFeedback,
  argTypes: {
    text: { control: 'text' },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<FormFeedbackProps> = ({ text, ...args }) => (
  <FormFeedback {...args}>{text}</FormFeedback>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
  text: 'First name is required.',
  invalid: true,
};
