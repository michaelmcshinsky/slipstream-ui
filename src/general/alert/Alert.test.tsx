import React from 'react';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Alert } from './Alert';

describe('Alert', () => {
  it('should render the alert without crashing', () => {
    const { getByText } = render(<Alert>Hello World</Alert>);

    expect(getByText('Hello World')).toBeInTheDocument();
  })
})