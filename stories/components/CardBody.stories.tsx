import React from 'react';
import { Meta, Story } from '@storybook/react';
import { CardBody, CardBodyProps } from '../../src/global';

export default {
  title: 'Components/Global/CardBody',
  component: CardBody,
  argTypes: {
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<CardBodyProps> = ({ ...args }) => (
  <CardBody {...args}>
    <p>lorem ipsum dolor sit amet</p>
    <p>lorem ipsum dolor sit amet</p>
    <p>lorem ipsum dolor sit amet</p>
    <p>lorem ipsum dolor sit amet</p>
    <p>lorem ipsum dolor sit amet</p>
  </CardBody>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
};
