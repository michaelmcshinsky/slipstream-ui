import React from 'react';
import { Meta, Story } from '@storybook/react';
import { CardFooter as CardFooterComponent, CardFooterProps, Button } from '../../src';

export default {
  title: 'Components/Global/Card',
  component: CardFooterComponent,
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

const Template: Story<CardFooterProps> = ({ ...args }) => (
  <CardFooterComponent
    className="justify-between"
  {...args}>
    <Button color="danger">Delete</Button>
    <Button>Submit</Button>
  </CardFooterComponent>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const CardFooter = Template.bind({});

CardFooter.args = {
};
