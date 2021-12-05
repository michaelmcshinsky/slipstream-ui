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
  href?: string | undefined;
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
  (props: ButtonProps, ref: any) => {
    let { tag: Tag } = props;
    const {
      children,
      className,
      color,
      size,
      flush,
      block,
      ...attrs
    } = props;

    const classes = classNames(
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
        ref={ref}
        className={classes}
        {...attrs}
      >
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
  size: 'md'
};

export default Button;
