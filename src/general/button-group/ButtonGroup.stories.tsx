import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ButtonGroup as ButtonGroupComponent, TButtonGroup } from './ButtonGroup';
import { Button } from '../button';

export default {
  title: 'Components/Forms',
  component: ButtonGroupComponent,
  argTypes: {
    flush: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TButtonGroup> = ({ ...args }) => (
  <ButtonGroupComponent {...args}>
    <Button color="default">Primary</Button>
    <Button color="default">Secondary</Button>
    <Button color="default">Warning</Button>
    <Button color="default">Danger</Button>
  </ButtonGroupComponent>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const ButtonGroup = Template.bind({});

ButtonGroup.args = {};
