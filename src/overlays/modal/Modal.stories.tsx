import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Modal, ModalProps, Button, SlipstreamProvider } from '../../';
import { Test } from './Test';

export default {
  title: 'Components/Overlays/Modal',
  component: Modal,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: [
          'xs',
          'sm',
          'md',
          'lg',
          'xl',
          '2xl',
          '3xl',
          '4xl',
          '5xl',
          'full',
        ],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<ModalProps> = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);

  function _toggle() {
    setIsOpen(!isOpen);
  }

  function _handleSave(e?: any, closeModal?: any) {
    alert('Submit and then trigger closing of modal as callback');
    closeModal();
  }

  return (
    <SlipstreamProvider>
      <Button onClick={_toggle}>Open Modal</Button>
      <Test isOpen={isOpen} toggle={_toggle} handleSave={_handleSave}/>
    </SlipstreamProvider>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const _KitchenSink = Template.bind({});

_KitchenSink.args = {};
