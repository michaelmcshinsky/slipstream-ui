import React from 'react';
import { Meta, Story } from '@storybook/react';
import { FormFeedback as FormFeedbackComponent, TFormFeedback } from './FormFeedback';

export default {
  title: 'Components/Forms',
  component: FormFeedbackComponent,
  argTypes: {
    children: { control: 'text' },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TFormFeedback> = ({ children, ...args }) => (
  <FormFeedbackComponent {...args}>{children}</FormFeedbackComponent>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const FormFeedback = Template.bind({});

FormFeedback.args = {
  children: 'First name is required.',
  invalid: true,
};
