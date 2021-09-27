import React, { forwardRef, ReactNode } from 'react';
import { Checkbox } from './Checkbox';

enum RadioEnum {
  danger,
  default,
  primary,
  success,
  warning,
}

export interface RadioProps {
  checked?: boolean;
  children?: ReactNode;
  className?: string;
  color?: keyof typeof RadioEnum;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  required?: boolean;
  rtl?: boolean;
  size?: 'md' | 'lg';
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
}

export const Radio = forwardRef<HTMLLabelElement, RadioProps>(
  (props, ref) => {
    const {
      ...attrs
    } = props;

    return (
      <Checkbox ref={ref} {...attrs} type="radio"/>
    );
  }
);

export default Radio;
