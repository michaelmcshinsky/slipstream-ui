import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Text as TextComponent, TText, SlipstreamProvider } from '../..';

export default {
  title: 'Components/Elements/Text',
  component: TextComponent,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<TText> = ({ ...args }) => (
  <SlipstreamProvider>
    <TextComponent {...args}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean semper
      faucibus eros et pharetra. Vestibulum mattis, ligula sed sollicitudin
      fermentum, est ligula euismod enim, ornare dapibus nunc nunc ultricies
      mauris. Sed bibendum libero velit, ut hendrerit nisi feugiat vel. Vivamus
      nisl est, maximus ac eleifend ut, tincidunt ut felis. Suspendisse in
      suscipit metus. Vestibulum ac interdum enim, nec mattis est. Praesent
      lacinia vitae diam at viverra. Phasellus eu egestas dolor.
    </TextComponent>
  </SlipstreamProvider>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Text = Template.bind({});

Text.args = {};
