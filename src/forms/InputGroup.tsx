import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { InputProps } from './Input';
import InputGroupAppend, { InputGroupAppendProps } from './InputGroupAppend';
import InputGroupPrepend, { InputGroupPrependProps } from './InputGroupPrepend';

export interface InputGroupProps {
  children?: ReactNode;
  inputProps?: InputProps;
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
  ({ children, inputProps, ...props }, ref) => {
    const classes = classNames(
      'sui--input-group',
      'relative flex items-stretch w-full'
    );

    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (child?.type?.displayName) {
          const { displayName } = child?.type;
          if (displayName === 'Input') {
            return React.cloneElement(child, {
              className: 'self-stretch h-auto',
              ...inputProps,
            });
          } else if (displayName === 'InputGroupPrepend') {
            return React.cloneElement(child, {
              className: 'rounded-l-sm',
              size: inputProps?.size,
            });
          } else if (displayName === 'InputGroupAppend') {
            return React.cloneElement(child, {
              className: 'rounded-r-sm',
              size: inputProps?.size,
            });
          } else {
            return child;
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
InputGroup.Append = InputGroupAppend;
InputGroup.Prepend = InputGroupPrepend;

export default InputGroup;
