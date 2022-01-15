import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Container,
  Form as FormComponent,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Checkbox,
  Radio,
  Switch,
  Textarea,
  SlipstreamProvider,
} from '../..';

export default {
  title: 'Components/Forms',
  component: FormComponent,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story = ({ ...args }) => {
  function _handleSubmit(e) {
    e.preventDefault();
    alert('Form submitted!');
  }

  return (
    <SlipstreamProvider dark>
      <Container size="xl" className="py-4 bg-gray-900">
        <FormComponent {...args} onSubmit={_handleSubmit}>
          <FormGroup>
            <Label htmlFor="form-firstName">First Name</Label>
            <Input
              id="form-firstName"
              type="text"
              name="firstName"
              placeholder="First Name"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="form-lastName">Last Name</Label>
            <Input id="form-lastName" type="text" name="lastName" />
          </FormGroup>
          <FormGroup>
            <Checkbox checked={true}>Checkbox Label</Checkbox>
            <Radio checked={true}>Radio Label</Radio>
          </FormGroup>
          <FormGroup>
            <Textarea/>
          </FormGroup>
          <div className="flex flex-row mb-4">
            <Switch color="red" checked={true}></Switch>
            <Switch></Switch>
          </div>
          <FormGroup>
            <Button>Submit</Button>
          </FormGroup>
          <Alert color="yellow">
            Something must have gone wrong... apparently...
          </Alert>
        </FormComponent>
      </Container>
    </SlipstreamProvider>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Form = Template.bind({});

Form.args = {};
