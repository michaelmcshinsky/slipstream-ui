import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';

export interface FormGroupProps {
  className?: string;
  children?: ReactNode;
}

export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  (props, ref) => {
    const { className, children, ...attributes } = props;
    const classes = classnames('mb-4 flex flex-col', className);

    return (
      <div ref={ref} className={classes} {...attributes}>
        {children}
      </div>
    );
  }
);

export default FormGroup;
