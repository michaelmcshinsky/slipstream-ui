import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ListGroup, ListGroupProps, ListGroupItem } from '../../../src';

export default {
  title: 'Components/General/ListGroup',
  component: ListGroup,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<ListGroupProps> = ({ ...args }) => (
  <ListGroup {...args}>
    <ListGroupItem>List Item One</ListGroupItem>
    <ListGroupItem>List Item Two</ListGroupItem>
    <ListGroupItem>List Item Three</ListGroupItem>
    <ListGroupItem>List Item Four</ListGroupItem>
    <ListGroupItem>List Item Five</ListGroupItem>
  </ListGroup>
);

export const Default = Template.bind({});

Default.args = {};
