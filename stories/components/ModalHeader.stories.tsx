import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ModalHeader, ModalHeaderProps } from '../../src';

export default {
  title: 'Components/Overlays/ModalHeader',
  component: ModalHeader,
  argTypes: {
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<ModalHeaderProps> = args => {

  function _onClose(e) {
    console.log('e', e)
    alert('Closing Modal!')
  }

  return (
    <ModalHeader onClose={_onClose} {...args}/>
  )
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
  title: 'Modal Title',
};