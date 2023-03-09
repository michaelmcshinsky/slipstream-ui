import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import InputGroupAppend, { TInputGroupAppend } from './InputGroupAppend';
import InputGroupPrepend, { TInputGroupPrepend } from './InputGroupPrepend';

export type TInputGroup = {
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
};

type InputGroupComponent = React.ForwardRefExoticComponent<
  TInputGroup & React.RefAttributes<HTMLDivElement>
> & {
  Append: React.ForwardRefExoticComponent<
    TInputGroupAppend & React.RefAttributes<HTMLDivElement>
  >;
  Prepend: React.ForwardRefExoticComponent<
    TInputGroupPrepend & React.RefAttributes<HTMLDivElement>
  >;
};

export const InputGroup = forwardRef<HTMLDivElement, TInputGroup>(
  ({ children, className, invalid, size, ...props }, ref) => {
    const classes = clsx(
      'sui--input-group',
      'flex items-center relative w-full group',
      className
    );

    const elSize = size || 'md';

    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (child?.type?.displayName) {
          const { displayName } = child?.type;
          if (
            displayName === 'Input' ||
            displayName === 'InputGroupPrepend' ||
            displayName === 'InputGroupAppend'
          ) {
            return React.cloneElement(child, {
              size: elSize,
              invalid,
            });
          }
        }
        return child;
      });

    return (
      <div ref={ref} className={classes} {...props}>
        {renderedChildren}
      </div>
    );
  }
) as InputGroupComponent;

InputGroup.displayName = 'InputGroup';
InputGroup.defaultProps = {
  size: 'md',
};
InputGroup.Append = InputGroupAppend;
InputGroup.Prepend = InputGroupPrepend;

export default InputGroup;
