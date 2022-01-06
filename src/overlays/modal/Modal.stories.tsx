import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Modal, ModalProps } from './Modal';
import { Button } from '../..';

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
    <>
      <Button onClick={_toggle}>Open Modal</Button>
      <Modal isOpen={isOpen} {...args} toggle={_toggle}>
        <Modal.Header title="Modal Title" />
        <Modal.Body>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            vehicula auctor libero, in congue nulla rhoncus ut. Mauris vitae
            neque volutpat, viverra lorem id, dictum nunc. Vestibulum ante ipsum
            primis in faucibus orci luctus et ultrices posuere cubilia curae; In
            hac habitasse platea dictumst. Aliquam convallis ultricies nunc.
            Fusce vel erat non ligula semper suscipit quis in quam. Duis
            tincidunt, felis at ultricies tincidunt, enim turpis sodales massa,
            quis fringilla nunc urna vehicula enim. Etiam condimentum accumsan
            condimentum.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Modal.Button type="button" className="mr-2" color="link" close>
            Cancel
          </Modal.Button>
          <Modal.Button type="button" onClick={_handleSave}>Create</Modal.Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const _KitchenSink = Template.bind({});

_KitchenSink.args = {};
