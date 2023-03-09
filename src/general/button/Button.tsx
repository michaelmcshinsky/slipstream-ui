import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
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
    e: React.MouseEventHandler<HTMLElement>,
    callback?: () => any
  ) => void;
  size?: 'sm' | 'md' | 'lg';
  tag?: any;
  type?: keyof typeof Type;
  flush?: boolean;
  block?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, TButton>(
  (props: TButton, ref: any) => {
    let { tag: Tag } = props;
    const { children, className, color, size, flush, block, ...attrs } = props;

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
      <Tag ref={ref} className={classes} {...attrs}>
        {children}
      </Tag>
    );
  }
);

Button.displayName = 'Button';
Button.defaultProps = {
  tag: 'button',
  color: 'primary',
  type: 'button',
  size: 'md',
};

export default Button;
