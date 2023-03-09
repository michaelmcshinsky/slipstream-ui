import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Card, TCard, Button, SlipstreamProvider } from '../../';

export default {
  title: 'Components/General/Card',
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

const Template: Story<TCard> = ({ ...args }) => (
  <SlipstreamProvider>
    <Card {...args}>
      <Card.Header>
        <Card.Title>Card Title</Card.Title>
      </Card.Header>
      <Card.Body>
        <p>lorem ipsum dolor sit amet</p>
        <p>lorem ipsum dolor sit amet</p>
        <p>lorem ipsum dolor sit amet</p>
        <p>lorem ipsum dolor sit amet</p>
        <p>lorem ipsum dolor sit amet</p>
      </Card.Body>
      <Card.Footer className="justify-between">
        <Button color="danger">Delete</Button>
        <Button>Submit</Button>
      </Card.Footer>
    </Card>
  </SlipstreamProvider>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const _KitchenSink = Template.bind({});

_KitchenSink.args = {
  size: 'md',
};
