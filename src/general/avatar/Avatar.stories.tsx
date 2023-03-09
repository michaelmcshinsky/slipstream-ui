import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Avatar, TAvatar } from './Avatar';

export default {
  title: 'Components/General/Avatar',
  component: Avatar,
  argTypes: {
    label: { control: 'text' },
    src: { control: 'text' },
    color: {
      control: {
        type: 'select',
        options: [
          'gray',
          'red',
          'yellow',
          'green',
          'blue',
          'indigo',
          'purple',
          'pink',
        ],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TAvatar> = ({
  label,
  src,
  size,
  color,
  ...args
}) => (
  <Avatar label={label} src={src} size={size} color={color} {...args}/>
);

export const Initials = Template.bind({});

Initials.args = {
  label: 'AA',
};

export const Image = Template.bind({});

Image.args = {
  src: '/avatar.png',
};
