import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Datalist as DatalistComponent,
  DatalistProps,
} from './Datalist';
import { FormGroup } from '../form-group';

export default {
  title: 'Components/Forms',
  component: DatalistComponent,
  argTypes: {
    id: { control: 'text' },
    list: { control: 'text' },
    placeholder: { control: 'text' },
    autoComplete: { control: 'text' },
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<DatalistProps> = ({ ...args }) => {
  const [value, setValue] = useState('');

  function _handleChange(event) {
    setValue(event.target.value);
  }

  return (
    <>
      <FormGroup>
        <DatalistComponent {...args} onChange={_handleChange} />
      </FormGroup>
      <pre className="p-3 text-sm bg-gray-100 border border-gray-200 border-solid">
        State Value: {value}
      </pre>
    </>
  );
};
// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Datalist = Template.bind({});

Datalist.args = {
  id: 'suggestions',
  list: 'suggestions',
  placeholder: 'Search Suggestions',
  autoComplete: 'on',
  options: [
    { value: 'DVDs', label: 'DVDs' },
    { value: 'Gum', label: 'Gum' },
    { value: 'Printer', label: 'Printer' },
    { value: 'Nail', label: 'Nail' },
    { value: 'Gift', label: 'Gift' },
    { value: 'Cactus', label: 'Cactus' },
    { value: 'Rubber', label: 'Rubber' },
    { value: 'Stapler', label: 'Stapler' },
    { value: 'Duct', label: 'Duct' },
    { value: 'Water', label: 'Water' },
    { value: 'Beanie', label: 'Beanie' },
    { value: 'Hamper', label: 'Hamper' },
    { value: 'Camcorder', label: 'Camcorder' },
    { value: 'String', label: 'String' },
    { value: 'Taxidermy', label: 'Taxidermy' },
    { value: 'Engagement', label: 'Engagement' },
    { value: 'Fidget', label: 'Fidget' },
    { value: 'Ladle', label: 'Ladle' },
    { value: 'Stickers', label: 'Stickers' },
    { value: 'Lawnmower', label: 'Lawnmower' },
    { value: 'Toothpicks', label: 'Toothpicks' },
    { value: 'Keychain', label: 'Keychain' },
    { value: 'Lantern', label: 'Lantern' },
    { value: 'Passport', label: 'Passport' },
    { value: 'Stamp', label: 'Stamp' },
    { value: 'Booty', label: 'Booty' },
    { value: 'Cotton', label: 'Cotton' },
    { value: 'Curlers', label: 'Curlers' },
    { value: 'Unicorn', label: 'Unicorn' },
    { value: 'Garage', label: 'Garage' },
    { value: 'Knee', label: 'Knee' },
    { value: 'Mustache', label: 'Mustache' },
    { value: 'Shoe', label: 'Shoe' },
  ],
};
