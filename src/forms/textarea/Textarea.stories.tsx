import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Textarea as TextareaComponent, TextareaProps } from './Textarea';

export default {
  title: 'Components/Forms',
  component: TextareaComponent,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TextareaProps> = args => <TextareaComponent {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Textarea = Template.bind({});

Textarea.args = {};
