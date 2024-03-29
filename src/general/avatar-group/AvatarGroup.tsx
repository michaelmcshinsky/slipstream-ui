import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TAvatarGroup = {
  children?: ReactNode;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  textSize?: string;
}

export const AvatarGroup = forwardRef<HTMLDivElement, TAvatarGroup>(
  ({ children, className, size, rounded, textSize, ...props }, ref) => {
    const classes = clsx(
      'sui--avatar-group',
      'flex items-center space-x-8',
      clsx
    );

    const innerClasses = clsx(
      'flex overflow-hidden',
      { '-space-x-2': size === 'sm' },
      { '-space-x-5': size === 'md' },
      { '-space-x-8': size === 'lg' },
      { '-space-x-10': size === 'xl' }
    );

    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (child?.type?.displayName?.includes('Avatar')) {
          const classes = clsx(
            'border-solid border-white',
            { border: size === 'sm' },
            { 'border-2': size !== 'sm' }
          );

          return React.cloneElement(child, {
            className: classes,
            textSize,
            rounded,
            size,
          });
        }
        return child;
      });

    return (
      <div ref={ref} className={classes} {...props}>
        <div className={innerClasses}>{renderedChildren}</div>
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';
AvatarGroup.defaultProps = {
  size: 'md',
  rounded: 'full',
};

export default AvatarGroup;
