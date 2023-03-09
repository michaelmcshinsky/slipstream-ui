import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Drawer, TDrawer } from './Drawer';
import { Button } from '../..';

export default {
  title: 'Components/Overlays/Drawer',
  component: Drawer,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TDrawer> = ({ ...args }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center justify-center">
      <Button className="m-4" onClick={() => setIsOpen(true)}>
        Click Me
      </Button>
      <Drawer
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
        className="p-3"
        {...args}
      >
        <h1>Menu</h1>
      </Drawer>
    </div>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const _KitchenSink = Template.bind({});

_KitchenSink.args = {};
