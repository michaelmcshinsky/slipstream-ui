import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  ModalFooter as Footer,
  ModalFooterProps,
  ModalButton,
} from '../..';

export default {
  title: 'Components/Overlays/Modal',
  component: Footer,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<ModalFooterProps> = (args) => {
  return (
    <Footer className="justify-between">
      <ModalButton color="danger">Delete</ModalButton>
      <span>
        <ModalButton color="link" className="mr-2">
          Close
        </ModalButton>
        <ModalButton>Submit</ModalButton>
      </span>
    </Footer>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const ModalFooter = Template.bind({});

ModalFooter.args = {};
