import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Avatar, AvatarProps } from '../../src';

export default {
  title: 'Components/Extra/Avatar',
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
    size: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg'],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<AvatarProps> = ({
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
