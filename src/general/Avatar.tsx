import React, { forwardRef, HTMLAttributes } from 'react';
import classNames from 'classnames';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  label?: string;
  src?: string;
  color?: string;
  colorCustom?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  textSize?: string;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  const {
    className,
    label,
    src,
    color,
    colorCustom,
    rounded,
    size,
    textSize,
    children,
    ...attrs
  } = props;

  function _renderChildren() {
    if (label) {
      return label;
    } else if (src) {
      return <img src={src} alt="avatar" className="max-w-full max-h-full" />;
    } else {
      return null;
    }
  }

  const bgTheme = colorCustom
    ? color
    : color
    ? `bg-${color}-300`
    : `bg-gray-300`;

  const radius = rounded
    ? rounded === 'md'
      ? 'rounded'
      : `rounded-${rounded}`
    : '';

  const classes = classNames(
    'sui--avatar',
    `sui--avatar-color_${color}`,
    'relative flex items-center justify-center overflow-hidden leading-none',
    { 'w-6 h-6': size === 'sm' },
    { 'text-xs': size === 'sm' && !textSize },
    { 'w-10 h-10': size === 'md' },
    { 'text-base': size === 'md' && !textSize },
    { 'w-16 h-16': size === 'lg' },
    { 'text-3xl': size === 'lg' && !textSize },
    { 'w-24 h-24': size === 'xl' },
    { 'text-4xl': size === 'xl' && !textSize },
    { [`text-${textSize}`]: textSize },
    radius,
    bgTheme,
    className
  );

  if (label) {
  }

  return (
    <div className={classes} ref={ref} {...attrs}>
      {_renderChildren()}
    </div>
  );
});

Avatar.displayName = 'Avatar';
Avatar.defaultProps = {
  color: 'gray',
  size: 'md',
  rounded: 'lg',
};

export default Avatar;
