import React from 'react';
import { Meta, Story } from '@storybook/react';
import { CardFooter, CardFooterProps, Button } from '../../src';

export default {
  title: 'Components/Global/CardFooter',
  component: CardFooter,
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
  <CardFooter
    className="justify-between"
  {...args}>
    <Button color="danger">Delete</Button>
    <Button>Submit</Button>
  </CardFooter>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
};
