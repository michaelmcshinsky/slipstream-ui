import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Container as ContainerComponent,
  ContainerProps,
  Row,
  Col,
  Center,
} from '../../../src';

export default {
  title: 'Components/Layout',
  component: ContainerComponent,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<ContainerProps> = ({ ...args }) => (
  <ContainerComponent {...args}>
    <Row>
      <Col sm="1/3">
        <Center className="my-2 p-4 bg-blue-200 border border-solid border-blue-400">
          Column
        </Center>
      </Col>
      <Col sm="1/3">
        <Center className="my-2 p-4 bg-blue-200 border border-solid border-blue-400">
          Column
        </Center>
      </Col>
      <Col sm="1/3">
        <Center className="my-2 p-4 bg-blue-200 border border-solid border-blue-400">
          Column
        </Center>
      </Col>
      <Col sm="1/3">
        <Center className="my-2 p-4 bg-blue-200 border border-solid border-blue-400">
          Column
        </Center>
      </Col>
      <Col sm="1/3">
        <Center className="my-2 p-4 bg-blue-200 border border-solid border-blue-400">
          Column
        </Center>
      </Col>
    </Row>
  </ContainerComponent>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const KitchenSink = Template.bind({});

KitchenSink.args = {};
