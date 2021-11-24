import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  AvatarGroup as AvatarGroupComponent,
  AvatarGroupProps,
} from './AvatarGroup';
import { Avatar } from '../avatar'

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
    <Avatar src="/avatar.png" />
    <Avatar src="/avatar.png" />
    <Avatar src="/avatar.png" />
  </AvatarGroupComponent>
);

AvatarGroup.defaultProps = {

}