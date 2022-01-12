import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface FieldSetLegendProps {
  className?: string;
  children?: ReactNode;
  custom?: boolean;
}

export const FieldSetLegend = forwardRef<
  HTMLLegendElement,
  FieldSetLegendProps
>(({ className, children, custom, ...props }, ref) => {
  const classes = classNames(
    'sui--fieldset-legend',
    !custom && 'block px-1 text-sm -mx-0.5',
    className
  );

  return (
    <legend ref={ref} className={classes} {...props}>
      {children}
    </legend>
  );
});

FieldSetLegend.displayName = 'FieldSetLegend';

export default FieldSetLegend;
