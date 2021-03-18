import React, { forwardRef, HTMLAttributes } from 'react';
import classnames from 'classnames';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  label?: string;
  src?: string;
  color?: string;
  size?: string;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  const {
    className,
    label,
    src,
    color = 'gray',
    size = 'md',
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

  const bgTheme = color ? `bg-${color}-300` : `bg-gray-300`;

  const classes = classnames(
    'rounded-full relative flex items-center justify-center overflow-hidden',
    { 'w-6 h-6 text-xs': size === 'sm' },
    { 'w-8 h-8 text-sm': size === 'md' || !size },
    { 'w-10 h-10 text-base': size === 'lg' },
    bgTheme
  );

  if (label) {
  }

  return (
    <div className={classes} ref={ref} {...attrs}>
      {_renderChildren()}
    </div>
  );
});

export default Avatar;
