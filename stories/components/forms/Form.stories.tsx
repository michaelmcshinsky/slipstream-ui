import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Container, Form as FormComponent, FormGroup, Label, Input, Button, Alert } from '../../../src';

export default {
  title: 'Components/Forms',
  component: FormComponent,
  argTypes: {
  },
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story = ({ ...args }) => {
  function _handleSubmit(e) {
    e.preventDefault();
    alert('Form submitted!')
  }

  return (
    <Container size='xl'>
      <FormComponent {...args} onSubmit={_handleSubmit}>
        <FormGroup>
          <Label htmlFor="form-firstName">First Name</Label>
          <Input
            id="form-firstName"
            type="text"
            name="firstName"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="form-lastName">Last Name</Label>
          <Input
            id="form-lastName"
            type="text"
            name="lastName"
          />
        </FormGroup>
        <FormGroup>
          <Button>Submit</Button>
        </FormGroup>
        <Alert color="yellow">Something must have gone wrong... apparently...</Alert>
      </FormComponent>
    </Container>
  )
}

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Form = Template.bind({});

Form.args = {
};
