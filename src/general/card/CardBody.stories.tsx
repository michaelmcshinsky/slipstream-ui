import React from 'react';
import { Meta, Story } from '@storybook/react';
import { CardBody as CardBodyComponent, TCardBody } from './CardBody';

export default {
  title: 'Components/General/Card',
  component: CardBodyComponent,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TCardBody> = ({ ...args }) => (
  <CardBodyComponent {...args}>
    <p>lorem ipsum dolor sit amet</p>
    <p>lorem ipsum dolor sit amet</p>
    <p>lorem ipsum dolor sit amet</p>
    <p>lorem ipsum dolor sit amet</p>
    <p>lorem ipsum dolor sit amet</p>
  </CardBodyComponent>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const CardBody = Template.bind({});

CardBody.args = {};
