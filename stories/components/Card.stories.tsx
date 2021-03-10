import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Card,
  CardProps,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Button,
} from '../../src';

export default {
  title: 'Components/Global/Card',
  component: Card,
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

const Template: Story<CardProps> = ({ ...args }) => (
  <Card {...args}>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
    </CardHeader>
    <CardBody>
      <p>lorem ipsum dolor sit amet</p>
      <p>lorem ipsum dolor sit amet</p>
      <p>lorem ipsum dolor sit amet</p>
      <p>lorem ipsum dolor sit amet</p>
      <p>lorem ipsum dolor sit amet</p>
    </CardBody>
    <CardFooter className="justify-between">
      <Button color="danger">Delete</Button>
      <Button>Submit</Button>
    </CardFooter>
  </Card>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const KitchenSink = Template.bind({});

KitchenSink.args = {
  size: 'md'
};
