import React, { forwardRef, ReactNode, HTMLAttributes } from 'react';
import classNames from 'classnames';
import theme from '../theme/default';

enum ButtonEnum {
  danger,
  default,
  link,
  primary,
  success,
  warning,
}

enum Type {
  Button = 'button',
  Submit = 'submit',
  Reset = 'reset',
}

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  color?: keyof typeof ButtonEnum;
  disabled?: boolean;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  tag?: any;
  type?: Type;
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
      ...attrs
    } = props;

    const classes = classNames(
      theme.button.base,
      color && theme.button.color[color],
      { [theme.button.size.sm]: size === 'sm' },
      { [theme.button.size.md]: size === 'md' || !size },
      { [theme.button.size.lg]: size === 'lg' },
      disabled && theme.disabled,
      className
    );

    if (href && Tag === 'button') {
      Tag = 'a';
    }

    return (
      <Tag
        className={classes}
        disabled={disabled}
        href={href}
        ref={ref}
        type={type}
        {...attrs}
      >
        {children}
      </Tag>
    );
  }
);

export default Button;
