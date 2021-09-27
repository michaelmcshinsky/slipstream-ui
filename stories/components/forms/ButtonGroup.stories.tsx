import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ButtonGroup as ButtonGroupComponent, ButtonGroupProps, Button } from '../../../src';

export default {
  title: 'Components/Forms',
  component: ButtonGroupComponent,
  argTypes: {
    flush: {
      control: {
        type: 'boolean'
      }
    }
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<ButtonGroupProps> = ({ ...args }) => (
  <ButtonGroupComponent {...args}>
    <Button color="primary">Primary</Button>
    <Button color="success">Secondary</Button>
    <Button color="warning">Warning</Button>
    <Button color="danger">Danger</Button>
  </ButtonGroupComponent>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const ButtonGroup = Template.bind({});

ButtonGroup.args = {};
