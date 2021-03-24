import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Modal, ModalBody, ModalHeader, ModalFooter, ModalButton, Button, } from '../../src';

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

const Template: Story<ModalProps> = args => {

  const [isOpen, setIsOpen] = useState(false);

  function _toggle () {
    console.log('isOpen', isOpen)
    setIsOpen(!isOpen);
  }

  function _handleSave (e, closeModal) {
    alert('Submit and then trigger closing of modal as callback');
    closeModal();
  }

  return (
    <>
      <Button onClick={ _toggle }>Open Modal</Button>
      <Modal isOpen={ isOpen } { ...args } toggle={ _toggle }>
        <ModalHeader title="Modal Title" />
        <ModalBody>
          <h3>Test Header</h3>
          <p>Lorem Ipsum Dolar</p>
          <p>Lorem Ipsum Dolar</p>
          <p>Lorem Ipsum Dolar</p>
          <p>Lorem Ipsum Dolar</p>
          <p>Lorem Ipsum Dolar</p>
          <p>Lorem Ipsum Dolar</p>
          <p>Lorem Ipsum Dolar</p>
          <p>Lorem Ipsum Dolar</p>
        </ModalBody>
        <ModalFooter className="justify-between">
          <div className="flex-1">
            <ModalButton color="danger">Delete</ModalButton>
          </div>
          <ModalButton className="mr-2" color="link" close>Cancel</ModalButton>
          <ModalButton onClick={ _handleSave }>Create</ModalButton>
        </ModalFooter>
      </Modal>
    </>
  )
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
};