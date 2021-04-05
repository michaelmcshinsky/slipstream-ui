import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Modal,
  ModalProps,
  Button,
} from '../../src';

export default {
  title: 'Components/Overlays',
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

  function _toggle() {
    console.log('isOpen', isOpen);
    setIsOpen(!isOpen);
  }

  function _handleSave(e, closeModal) {
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
          <p>
            Nulla at risus laoreet, ultricies urna eget, tempor mauris. Quisque
            sit amet viverra metus. Duis dui dui, vestibulum nec feugiat ut,
            congue tempus elit. Aenean sit amet sem a eros sodales semper
            molestie a orci. Donec venenatis nisl a libero ultricies consequat.
            Donec porttitor lacus a iaculis elementum. Nam mi elit, hendrerit
            gravida dolor ac, hendrerit ultrices turpis. Nullam vitae orci
            euismod, efficitur felis ac, faucibus urna. Interdum et malesuada
            fames ac ante ipsum primis in faucibus. Suspendisse convallis tortor
            mauris. Pellentesque porttitor eget ipsum id euismod. Praesent
            gravida mi et feugiat venenatis. Nullam ultricies ante a arcu
            ornare, in aliquam lacus venenatis. Fusce suscipit est eleifend nisi
            tincidunt facilisis. Maecenas ut vulputate ante. Ut sed lacus ac
            risus luctus egestas.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-between">
          <div className="flex-1">
            <Modal.Button color="danger">Delete</Modal.Button>
          </div>
          <Modal.Button className="mr-2" color="link" close>
            Cancel
          </Modal.Button>
          <Modal.Button onClick={_handleSave}>Create</Modal.Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const _KitchenSink = Template.bind({});

_KitchenSink.args = {};
