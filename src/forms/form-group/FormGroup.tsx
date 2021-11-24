import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';

export interface FormGroupProps {
  className?: string;
  children?: ReactNode;
  margin?: string;
  inline?: boolean;
}

export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  (props, ref) => {
    const { className, children, margin, inline, ...attributes } = props;
    const classes = classnames(
      'sui--form-group flex',
      inline ? 'flex-row items-center' : 'flex-col items-start',
      { 'mb-4': !margin },
      margin,
      className
    );

    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (
          child?.type?.displayName === 'Label' ||
          child?.type?.displayName === 'Input'
        ) {
          return React.cloneElement(child, {
            inline,
          });
        }
        return React.cloneElement(child);
      });

    return (
      <div ref={ref} className={classes} {...attributes}>
        {renderedChildren}
      </div>
    );
  }
);

FormGroup.displayName = 'FormGroup';

export default FormGroup;
