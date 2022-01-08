import React, { ReactNode } from 'react';
import classNames from 'classnames';

export interface FieldSetLegendProps {
  className?: string;
  children: ReactNode;
  custom?: boolean;
}

export function FieldSetLegend({
  className,
  children,
  custom,
}: FieldSetLegendProps) {
  const classes = classNames(
    'sui--fieldset-legend',
    !custom && 'block px-1 text-sm -mx-0.5',
    className,
  );
  return <legend className={classes}>{children}</legend>;
}

FieldSetLegend.displayName = 'FieldSetLegend';

export default FieldSetLegend;
