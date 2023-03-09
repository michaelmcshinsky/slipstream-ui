import React, { forwardRef, ReactNode, SelectHTMLAttributes } from 'react';
import clsx from 'clsx';
import theme from '../../theme/default';
import SelectOption, { TSelectOption } from './SelectOption';
import SelectOptionGroup, { TSelectOptionGroup } from './SelectOptionGroup';

export type TSelect = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  children?: ReactNode;
  className?: string;
  custom?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  rounded?: boolean;
  rtl?: boolean;
  size?: 'sm' | 'md' | 'lg';
  success?: boolean;
};

type SelectComponent = React.ForwardRefExoticComponent<
  TSelect & React.RefAttributes<HTMLSelectElement>
> & {
  Option: React.ForwardRefExoticComponent<
    TSelectOption & React.RefAttributes<HTMLOptionElement>
  >;
  OptionGroup: React.ForwardRefExoticComponent<
    TSelectOptionGroup & React.RefAttributes<HTMLOptGroupElement>
  >;
};

export const Select = forwardRef<HTMLSelectElement, TSelect>((props, ref) => {
  const {
    children,
    className,
    custom,
    disabled,
    invalid,
    rounded,
    rtl,
    size,
    success,
    ...attrs
  } = props;

  const classes = clsx(
    'sui--select w-full appearance-none',
    !custom && [
      'py-0 px-2',
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
    ],
    className
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
}) as SelectComponent;

Select.displayName = 'Select';
Select.Option = SelectOption;
Select.OptionGroup = SelectOptionGroup;
Select.defaultProps = {
  disabled: false,
  size: 'md',
};

export default Select;
