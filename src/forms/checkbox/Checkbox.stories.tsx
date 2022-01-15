import React, { useState, useEffect } from 'react';
import { Meta, Story } from '@storybook/react';
import { Checkbox as CheckboxComponent, CheckboxProps, SlipstreamProvider } from '../..';

export default {
  title: 'Components/Forms',
  component: CheckboxComponent,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['md', 'lg'],
      },
    },
    color: {
      control: {
        type: 'select',
        options: ['danger', 'danger', 'link', 'primary', 'success', 'warning'],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<CheckboxProps> = ({ checked, ...args }) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (isChecked !== checked) {
      setIsChecked(checked);
    }
  }, [checked]);

  function _handleCheck() {
    setIsChecked(!isChecked);
  }

  return (
    <SlipstreamProvider dark>
      <div className="p-4 bg-gray-900">
        <CheckboxComponent {...args} checked={isChecked} onChange={_handleCheck}>
          I am a checkbox
        </CheckboxComponent>
      </div>
    </SlipstreamProvider>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Checkbox = Template.bind({});

Checkbox.args = {
  size: 'md',
  checked: false,
  color: 'primary',
};
