import clsx from 'clsx';
import React, { forwardRef, ReactNode } from 'react';
import { TWidth, Torder } from '../../utils';

export type TCol = {
  children?: ReactNode;
  className?: string;
  custom?: boolean;
  xs?: TWidth;
  sm?: TWidth;
  md?: TWidth;
  lg?: TWidth;
  xl?: TWidth;
  order?: Torder;
};

export const Col = forwardRef<HTMLDivElement, TCol>(
  (
    { children, className, custom, xs, sm, md, lg, xl, order, ...props },
    ref
  ) => {
    const classes = clsx(
      'sui--column',
      !custom && [
        'w-full px-2',
        xs && `xs:w-${xs}`,
        sm && `sm:w-${sm}`,
        md && `md:w-${md}`,
        lg && `lg:w-${lg}`,
        xl && `xl:w-${xl}`,
        { 'flex-1 max-w-full': !xs && !sm && !md && !lg && !xl },
      ],
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

Col.displayName = 'Col';

export default Col;
