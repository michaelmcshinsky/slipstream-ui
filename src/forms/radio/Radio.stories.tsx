import React, { useState, useEffect } from 'react';
import { Meta, Story } from '@storybook/react';
import { Radio as RadioComponent, TRadio } from './Radio';

export default {
  title: 'Components/Forms',
  component: RadioComponent,
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

const Template: Story<TRadio> = ({ checked, ...args }) => {
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
    <RadioComponent checked={isChecked} {...args} onChange={_handleCheck}>
      I am a checkbox
    </RadioComponent>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Radio = Template.bind({});

Radio.args = {
  size: 'md',
  checked: false,
  color: 'primary',
};
