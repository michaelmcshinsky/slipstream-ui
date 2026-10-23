import React, { ButtonHTMLAttributes, ElementType, forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import theme from '../../theme/default';

enum ButtonEnum {
  danger,
  default,
  link,
  primary,
  success,
  warning,
}

enum Type {
  button = 'button',
  reset = 'reset',
  submit = 'submit',
}

export type TButton = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick'
> & {
  children?: ReactNode;
  className?: string;
  color?: keyof typeof ButtonEnum;
  disabled?: boolean;
  href?: string | undefined;
  onClick?: (
    e: React.MouseEvent<HTMLElement>,
    callback?: () => void
  ) => void;
  size?: 'sm' | 'md' | 'lg';
  tag?: 'button' | 'a' | 'span';
  type?: keyof typeof Type;
  flush?: boolean;
  block?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, TButton>(
  (props: TButton, ref) => {
    const {
      tag: TagProp = 'button',
      children,
      className,
      color = 'primary',
      size = 'md',
      flush,
      block,
      type = 'button',
      ...attrs
    } = props;
    let Tag = TagProp as ElementType;

    const classes = clsx(
      'sui--button',
      `sui--button-color_${color}`,
      flush
        ? 'rounded-none first:rounded-l first:ml-0 -ml-px last:rounded-r hover:relative active:relative focus:relative'
        : 'rounded',
      'no-underline cursor-pointer',
      { 'w-full': block },
      { [theme.button.size.lg]: size === 'lg' },
      { [theme.button.size.md]: size === 'md' || !size },
      { [theme.button.size.sm]: size === 'sm' },
      color && theme.button.color[color],
      attrs.disabled && theme.disabled,
      theme.button.base,
      className
    );

    if (attrs.href && Tag === 'button') {
      Tag = 'a';
    }

    return (
      <Tag
        ref={ref as React.Ref<HTMLElement>}
        className={classes}
        type={Tag === 'button' ? type : undefined}
        {...attrs}
      >
        {children}
      </Tag>
    );
  }
);

Button.displayName = 'Button';

export default Button;
