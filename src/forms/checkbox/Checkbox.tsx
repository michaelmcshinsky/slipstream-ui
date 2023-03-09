import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { Label, TLabel } from '../label/Label';
import Input from '../input/Input';
import theme from '../../theme/default';

enum CheckboxEnum {
  danger,
  default,
  primary,
  success,
  warning,
}

export type TCheckbox = {
  children?: ReactNode;
  className?: string;
  color?: keyof typeof CheckboxEnum;
  custom?: boolean;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  labelProps?: TLabel;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  required?: boolean;
  rtl?: boolean;
  size?: 'md' | 'lg';
  type?: string;
}

export const Checkbox = forwardRef<HTMLLabelElement, TCheckbox>(
  (props, ref) => {
    const {
      children,
      className,
      color,
      custom,
      disabled,
      id,
      invalid,
      labelProps,
      onChange,
      required,
      rtl,
      size,
      type,
      ...attrs
    } = props;

    const inputClasses = clsx(
      'sui--checkbox',
      `sui--checkbox-color_${color}`,
      !custom && [
        'inline-block align-middle border-1 select-none appearance-none flex-shrink-0',
        { 'w-4 h-4': size === 'md' || !size },
        { 'w-6 h-6': size === 'lg' },
        color && theme.checkbox.color[color],
        type === 'radio' ? 'form-radio rounded-full' : 'form-checkbox rounded',
      ],
    );

    const labelClasses = clsx(
      'select-none',
      !custom && [
        { 'cursor-not-allowed': disabled },
        { 'text-base': size === 'lg' },
        { 'text-red-500': invalid },
        { 'text-sm': size === 'md' || !size },
      ],
      rtl ? 'order-first mr-2' : 'ml-2',
    );

    return (
      <Label
        ref={ref}
        className="inline-flex items-center"
        disabled={disabled}
        htmlFor={id}
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
  },
);

Checkbox.displayName = 'Checkbox';
Checkbox.defaultProps = {
  disabled: false,
  required: false,
  color: 'primary',
  size: 'md',
};

export default Checkbox;
