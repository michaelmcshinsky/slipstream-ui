import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  AvatarGroup as AvatarGroupComponent,
  AvatarGroupProps,
  Avatar,
} from '../../../src';

export default {
  title: 'Components/General/Avatar Group',
  component: AvatarGroupComponent,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

export const AvatarGroup = (args: AvatarGroupProps) => (
  <AvatarGroupComponent {...args}>
    <Avatar rounded="full" src={'/avatar.png'} />
    <Avatar rounded="full" src={'/avatar.png'} />
    <Avatar rounded="full" src={'/avatar.png'} />
  </AvatarGroupComponent>
);
