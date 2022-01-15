import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import InputGroupAppend, { InputGroupAppendProps } from './InputGroupAppend';
import InputGroupPrepend, { InputGroupPrependProps } from './InputGroupPrepend';

export interface InputGroupProps {
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
}

interface InputGroupComponent
  extends React.ForwardRefExoticComponent<
    InputGroupProps & React.RefAttributes<HTMLDivElement>
  > {
  Append: React.ForwardRefExoticComponent<
    InputGroupAppendProps & React.RefAttributes<HTMLDivElement>
  >;
  Prepend: React.ForwardRefExoticComponent<
    InputGroupPrependProps & React.RefAttributes<HTMLDivElement>
  >;
}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ children, className, invalid, size, ...props }, ref) => {
    const classes = classNames(
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
