import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Table, TableProps } from './Table';
console.log('Table', Table)
export default {
  title: 'Components/General/Table',
  component: Table,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TableProps> = ({ ...args }) => (
  <Table {...args}>
    <Table.Head>
      <Table.Row>
        <Table.Header>
          Header 1
        </Table.Header>
        <Table.Header>
          Header 2
        </Table.Header>
        <Table.Header>
          Header 3
        </Table.Header>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row active>
        <Table.Cell>
          Cell 1
        </Table.Cell>
        <Table.Cell>
          Cell 2
        </Table.Cell>
        <Table.Cell>
          Cell 3
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          Cell 1
        </Table.Cell>
        <Table.Cell>
          Cell 2
        </Table.Cell>
        <Table.Cell>
          Cell 3
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          Cell 1
        </Table.Cell>
        <Table.Cell>
          Cell 2
        </Table.Cell>
        <Table.Cell>
          Cell 3
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
);

export const Default = Template.bind({});

Default.args = {};
