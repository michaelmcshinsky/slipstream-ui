import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';

export interface FormGroupProps {
  className?: string;
  children?: ReactNode;
  margin?: string;
}

export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  (props, ref) => {
    const { className, children, margin, ...attributes } = props;
    const classes = classnames(
      'sui--form-group',
      'flex flex-col',
      { 'mb-4': !margin },
      margin,
      className
    );

    return (
      <div ref={ref} className={classes} {...attributes}>
        {children}
      </div>
    );
  }
);

FormGroup.displayName = 'FormGroup';

export default FormGroup;
