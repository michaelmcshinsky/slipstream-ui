import React, { forwardRef, ReactNode, HTMLAttributes } from 'react';
import classNames from 'classnames';
import theme from '../../theme/default';
import SelectOption, { SelectOptionProps } from './SelectOption';
import SelectOptionGroup, { SelectOptionGroupProps } from './SelectOptionGroup';

export interface SelectProps extends HTMLAttributes<HTMLSelectElement> {
  className?: string;
  disabled?: boolean;
  invalid?: boolean;
  success?: boolean;
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  children?: ReactNode;
  rtl?: boolean;
}

interface SelectComponent
  extends React.ForwardRefExoticComponent<
    SelectProps & React.RefAttributes<HTMLSelectElement>
  > {
  Option: React.ForwardRefExoticComponent<
    SelectOptionProps & React.RefAttributes<HTMLOptionElement>
  >;
  OptionGroup: React.ForwardRefExoticComponent<
    SelectOptionGroupProps & React.RefAttributes<HTMLOptGroupElement>
  >;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const {
      className,
      disabled = false,
      invalid,
      success,
      size = 'md',
      children,
      rounded,
      rtl,
      ...attrs
    } = props;

    const classes = classNames(
      'sui--select w-full appearance-none py-0 px-2',
      theme.form.base,
      invalid
        ? theme.form.invalid
        : success
        ? theme.form.success
        : theme.form.default,
      { 'h-7 text-xs': size === 'sm' },
      { 'h-8 text-sm': size === 'md' || !size },
      { 'h-10 text-base': size === 'lg' },
      disabled && theme.disabled,
      rounded ? 'rounded-full' : 'rounded',
      className,
    );

    return (
      <select
        ref={ref}
        className={classes}
        disabled={disabled}
        dir={rtl ? 'rtl' : 'auto'}
        {...attrs}
      >
        {children}
      </select>
    );
  },
) as SelectComponent;

Select.displayName = 'Select';
Select.Option = SelectOption;
Select.OptionGroup = SelectOptionGroup;

export default Select;
