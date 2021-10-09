import React, { ReactNode, HTMLAttributes } from 'react';
import classNames from 'classnames';

export interface FormFeedbackProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  valid?: boolean;
  invalid?: boolean;
  children?: ReactNode;
}

export function FormFeedback(props: FormFeedbackProps) {
  const { className, valid, invalid, children, ...attrs } = props;

  const classes = classNames(
    'sui--formfeedback text-sm',
    valid && !invalid && 'text-green-500',
    invalid && !valid && 'text-red-500',
    className
  );

  return (
    <div className={classes} {...attrs}>
      {children}
    </div>
  );
}

FormFeedback.defaultProps = {
  invalid: true,
};

export default FormFeedback;
