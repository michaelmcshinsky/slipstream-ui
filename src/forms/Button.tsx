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
  tag?: any;
  href?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: Type;
  children?: ReactNode;
  color?: keyof typeof ButtonEnum;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    let { tag: Tag = 'button' } = props;
    const {
      href,
      className,
      disabled = false,
      size = 'md',
      type = 'button',
      children,
      color = 'primary',
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

    let defaultType: Type = Type.Button;

    return (
      <Tag
        ref={ref}
        href={href}
        className={classes}
        disabled={disabled}
        type={defaultType}
        {...attrs}
      >
        {children}
      </Tag>
    );
  }
);

export default Button;
