import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { Label, LabelProps } from './Label';
import Input from './Input';
import theme from '../theme/default';

enum CheckboxEnum {
  danger,
  default,
  primary,
  success,
  warning,
}

export interface CheckboxProps {
  children?: ReactNode;
  className?: string;
  color?: keyof typeof CheckboxEnum;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  required?: boolean;
  rtl?: boolean;
  size?: 'md' | 'lg';
  type?: string;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  labelProps?: LabelProps;
}

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  (props, ref) => {
    const {
      children,
      className,
      color,
      disabled,
      id,
      invalid,
      onChange,
      required,
      rtl,
      size,
      type,
      labelProps,
      ...attrs
    } = props;

    const inputClasses = classNames(
      'sui--checkbox',
      `sui--checkbox-color_${color}`,
      'inline-block align-middle border-1 select-none appearance-none flex-shrink-0',
      { 'w-4 h-4': size === 'md' || !size },
      { 'w-6 h-6': size === 'lg' },
      color && theme.checkbox.color[color],
      type === 'radio' ? 'form-radio rounded-full' : 'form-checkbox rounded'
    );

    const labelClasses = classNames(
      'select-none',
      { 'cursor-not-allowed': disabled },
      { 'text-base': size === 'lg' },
      { 'text-red-500': invalid },
      { 'text-sm': size === 'md' || !size },
      rtl ? 'order-first mr-2' : 'ml-2'
    );

    return (
      <Label
        className="inline-flex items-center"
        disabled={disabled}
        htmlFor={id}
        ref={ref}
        required={required}
        {...labelProps}
        noMargin
      >
        <Input
          className={inputClasses}
          disabled={disabled}
          id={id}
          inline
          invalid={invalid}
          onChange={onChange}
          required={required}
          type={type || 'checkbox'}
          {...attrs}
        />
        <span className={labelClasses}>{children}</span>
      </Label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
Checkbox.defaultProps = {
  disabled: false,
  required: false,
  color: 'primary',
  size: 'md',
};

export default Checkbox;
