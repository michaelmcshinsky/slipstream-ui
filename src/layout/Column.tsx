import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { SizeListFull, OrderType } from '../utils';

export interface ColProps {
  children?: ReactNode;
  className?: string;
  xs?: SizeListFull;
  sm?: SizeListFull;
  md?: SizeListFull;
  lg?: SizeListFull;
  xl?: SizeListFull;
  order?: OrderType;
}

export const Col = forwardRef<HTMLDivElement, ColProps>(
  ({ children, className, xs, sm, md, lg, xl, order, ...props }, ref) => {
    const classes = classNames(
      'sui-column',
      'w-full px-2',
      xs && `xs:w-${xs}`,
      sm && `sm:w-${sm}`,
      md && `md:w-${md}`,
      lg && `lg:w-${lg}`,
      xl && `xl:w-${xl}`,
      { 'flex-1 max-w-full': !xs && !sm && !md && !lg && !xl },
      order && `order-${order}`,
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);