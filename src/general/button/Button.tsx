import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import theme from '../../theme/default';

enum ButtonEnum {
  danger,
  default,
  link,
  primary,
  success,
  warning,
}

interface Callback {
  (): void;
}

enum Type {
  Button = 'button',
  Reset = 'reset',
  Submit = 'submit',
}

export interface ButtonProps {
  children?: ReactNode;
  className?: string;
  color?: keyof typeof ButtonEnum;
  disabled?: boolean;
  href?: string;
  onClick?: (
    e: React.MouseEventHandler<HTMLButtonElement>,
    callback: Callback
  ) => void;
  size?: 'sm' | 'md' | 'lg';
  tag?: any;
  type?: Type;
  flush?: boolean;
  block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    let { tag: Tag = 'button' } = props;
    const {
      children,
      className,
      color = 'primary',
      disabled = false,
      href,
      size = 'md',
      type = 'button',
      flush,
      block,
      onClick,
      ...attrs
    } = props;

    const classes = classNames(
      'sui--button',
      `sui--button-color_${color}`,
      flush
        ? 'rounded-none first:rounded-l first:ml-0 -ml-px last:rounded-r'
        : 'rounded',
      'no-underline cursor-pointer',
      { 'w-full': block },
      { [theme.button.size.lg]: size === 'lg' },
      { [theme.button.size.md]: size === 'md' || !size },
      { [theme.button.size.sm]: size === 'sm' },
      color && theme.button.color[color],
      disabled && theme.disabled,
      theme.button.base,
      className,
    );

    if (href && Tag === 'button') {
      Tag = 'a';
    }

    return (
      <Tag
        className={classes}
        disabled={disabled}
        href={href}
        onClick={onClick}
        ref={ref}
        type={type}
        {...attrs}
      >
        {children}
      </Tag>
    );
  },
);

Button.displayName = 'Button';

export default Button;
