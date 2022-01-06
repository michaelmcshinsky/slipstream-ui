import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Backdrop, BackdropProps } from './Backdrop';
import { Button } from '../../';

export default {
  title: 'Components/Overlays/Backdrop',
  component: Backdrop,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<BackdropProps> = ({ ...args }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center justify-center">
      <Button className="m-4" onClick={() => setIsOpen(true)}>
        Click Me
      </Button>
      <Backdrop
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
        {...args}
      ></Backdrop>
    </div>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const _KitchenSink = Template.bind({});

_KitchenSink.args = {};
