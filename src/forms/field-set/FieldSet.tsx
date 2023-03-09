import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TFieldSet = {
  styles?: object;
  className?: string;
  children?: ReactNode;
  custom?: boolean;
}

export const FieldSet = forwardRef<HTMLFieldSetElement, TFieldSet>(
  ({ className, styles, children, custom, ...props }, ref) => {
    const classes = clsx(
      'sui--fieldset',
      !custom && 'block py-2 px-3 border border-solid border-gray-300',
      className
    );

    const fieldsetStyles = !custom
      ? {
          marginInlineStart: '2px',
          marginInlineEnd: '2px',
          ...styles,
        }
      : { ...styles };

    return (
      <fieldset ref={ref} style={fieldsetStyles} className={classes} {...props}>
        {children}
      </fieldset>
    );
  }
);

FieldSet.displayName = 'FieldSet';

export default FieldSet;
