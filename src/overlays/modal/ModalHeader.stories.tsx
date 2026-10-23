import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ModalHeader as Header, TModalHeader } from './ModalHeader';

export default {
  title: 'Components/Overlays/Modal',
  component: Header,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TModalHeader> = args => {
  function _toggle(e) {
    console.log('e', e);
    alert('Closing Modal!');
  }

  return <Header toggle={_toggle} {...args} />;
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const ModalHeader = Template.bind({});

ModalHeader.args = {
  title: 'Modal Title',
};
