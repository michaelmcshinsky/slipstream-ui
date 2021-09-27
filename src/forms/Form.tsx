import React, { forwardRef, ReactNode, HTMLAttributes } from 'react';
import classNames from 'classnames';

export interface FormProps extends HTMLAttributes<HTMLFormElement> {
  className?: string;
  children?: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Form = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
  const { className, children, onSubmit, ...attrs } = props;

  const classes = classNames(className);

  return (
    <form ref={ref} className={classes} onSubmit={onSubmit} {...attrs}>
      {children}
    </form>
  );
});

export default Form;
