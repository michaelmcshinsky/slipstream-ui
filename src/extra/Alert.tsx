import React, { forwardRef, HTMLAttributes } from 'react';
import classnames from 'classnames';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  icon?: boolean;
  color?: string;
  dark?: boolean;
  size?: string;
  onClick?: () => void;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  const {
    className,
    color = 'blue',
    dark = false,
    size = 'md',
    onClick,
    children,
    ...attrs
  } = props;

  const colorTheme = dark ? '500' : '100';
  const bgTheme = color
    ? `bg-${color}-${colorTheme}`
    : `bg-blue-${colorTheme}`;

  const classes = classnames(
    'rounded-md flex flex-wrap items-center relative pr-10',
    dark ? 'text-gray-100' : `text-${color || 'gray'}-900`,
    { 'text-sm px-3 py-2': size === 'sm' },
    { 'text-base px-4 py-3': size === 'md' || !size },
    { 'text-lg px-5 py-4': size === 'lg' },
    bgTheme
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

export default Alert;
