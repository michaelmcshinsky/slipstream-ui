import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import classnames from 'classnames';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  color?: string;
  dark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  shade?: string;
  onClick?: () => void;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  const {
    className,
    color,
    dark,
    size,
    onClick,
    children,
    shade,
    ...attrs
  } = props;

  const colorTheme =
    (color && color === 'black') || color === 'white'
      ? ''
      : shade
      ? `-${shade}`
      : dark
      ? '-500'
      : '-100';
  const bgTheme = color ? `bg-${color}${colorTheme}` : `bg-blue${colorTheme}`;

  const classes = classnames(
    'sui--alert',
    `sui--alert-color_${color}`,
    'rounded-md flex flex-wrap items-center relative pr-10',
    dark ? 'text-gray-100' : `text-${color || 'gray'}-700`,
    { 'text-sm px-3 py-2': size === 'sm' },
    { 'text-base px-4 py-3': size === 'md' || !size },
    { 'text-lg px-5 py-4': size === 'lg' },
    bgTheme,
    className
  );

  const btnClasses = classnames(
    'absolute top-0 right-0 bottom-0 mr-2 my-2',
    size === 'sm' ? 'p-1' : 'py-1 px-2'
  );

  const dimensions = classnames(
    { '12': size === 'sm' },
    { '16': size === 'md' || !size },
    { '20': size === 'lg' }
  );

  return (
    <div className={classes} role="alert" ref={ref} {...attrs}>
      {children}
      {onClick && (
        <button type="button" className={btnClasses} onClick={onClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            height={dimensions}
            width={dimensions}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
});

Alert.defaultProps = {
  color: 'blue',
  dark: false,
  size: 'md',
};

export default Alert;
