import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Table, TableProps } from './Table';

export default {
  title: 'Components/General/Table',
  component: Table,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TableProps> = ({ ...args }) => (
  <Table {...args} hover>
    {/* <Table.Caption>Caption</Table.Caption>
    <Table.ColGroup>
      <Table.Col className="bg-blue-300" span={2}/>
      <Table.Col className="bg-green-300" span={2}/>
    </Table.ColGroup> */}
    <Table.Head>      
      <Table.Row>
        <Table.Header>Header 1</Table.Header>
        <Table.Header>Header 2</Table.Header>
        <Table.Header>Header 3</Table.Header>
        <Table.Header>Header 4</Table.Header>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row active>
        <Table.Cell>Body Cell 1</Table.Cell>
        <Table.Cell>Body Cell 2</Table.Cell>
        <Table.Cell>Body Cell 3</Table.Cell>
        <Table.Cell>Body Cell 4</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Body Cell 1</Table.Cell>
        <Table.Cell>Body Cell 2</Table.Cell>
        <Table.Cell>Body Cell 3</Table.Cell>
        <Table.Cell>Body Cell 4</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Body Cell 1</Table.Cell>
        <Table.Cell>Body Cell 2</Table.Cell>
        <Table.Cell>Body Cell 3</Table.Cell>
        <Table.Cell>Body Cell 4</Table.Cell>
      </Table.Row>
    </Table.Body>
    <Table.Footer>
      <Table.Row>
        <Table.Cell>Footer Cell 1</Table.Cell>
        <Table.Cell>Footer Cell 2</Table.Cell>
        <Table.Cell>Footer Cell 3</Table.Cell>
        <Table.Cell>Footer Cell 4</Table.Cell>
      </Table.Row>
    </Table.Footer>
  </Table>
);

export const Default = Template.bind({});

Default.args = {};
