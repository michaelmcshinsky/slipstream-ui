import React, { ReactNode } from 'react';
import classNames from 'classnames';

interface FieldSetLegendProps {
  className?: string;
  children?: ReactNode
}

export function FieldSetLegend({ className, children }: FieldSetLegendProps) {
  const classes = classNames('block px-1 text-sm -mx-0.5', className);
  return <legend className={classes}>{children}</legend>;
}

export default FieldSetLegend;