import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ListGroup, ListGroupProps, SlipstreamProvider } from '../../';

export default {
  title: 'Components/General/ListGroup',
  component: ListGroup,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<ListGroupProps> = ({ ...args }) => (
  <SlipstreamProvider dark>
    <ListGroup {...args}>
      <ListGroup.Item>List Item One</ListGroup.Item>
      <ListGroup.Item active>List Item Two</ListGroup.Item>
      <ListGroup.Item>List Item Three</ListGroup.Item>
      <ListGroup.Item>List Item Four</ListGroup.Item>
      <ListGroup.Item>List Item Five</ListGroup.Item>
    </ListGroup>
  </SlipstreamProvider>
);

export const Default = Template.bind({});

Default.args = {};
