import React from 'react';
import { Modal } from './Modal';
import { Input } from '../../forms'

export interface TestProps {
  isOpen: boolean;
  toggle: any;
  handleSave: any
}

export function Test({ isOpen, toggle, handleSave }: TestProps) {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Modal.Header title="Modal Title" />
      <Modal.Body>
        <Input/>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          vehicula auctor libero, in congue nulla rhoncus ut. Mauris vitae neque
          volutpat, viverra lorem id, dictum nunc. Vestibulum ante ipsum primis
          in faucibus orci luctus et ultrices posuere cubilia curae; In hac
          habitasse platea dictumst. Aliquam convallis ultricies nunc. Fusce vel
          erat non ligula semper suscipit quis in quam. Duis tincidunt, felis at
          ultricies tincidunt, enim turpis sodales massa, quis fringilla nunc
          urna vehicula enim. Etiam condimentum accumsan condimentum.
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Modal.Button type="button" className="mr-2" color="link" close>
          Cancel
        </Modal.Button>
        <Modal.Button type="button" onClick={handleSave}>
          Create
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  );
}
