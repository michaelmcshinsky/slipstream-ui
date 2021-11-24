import React, { ReactNode, HTMLAttributes } from 'react';
import classNames from 'classnames';

export interface FormFeedbackProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  valid?: boolean;
  children?: ReactNode;
}

export function FormFeedback(props: FormFeedbackProps) {
  const { className, valid, children, ...attrs } = props;

  const classes = classNames(
    'sui--form-feedback text-sm',
    valid ? 'text-green-500' : 'text-red-500',
    className
  );

  return (
    <div className={classes} {...attrs}>
      {children}
    </div>
  );
}

FormFeedback.displayName = 'FormFeedback';

export default FormFeedback;
