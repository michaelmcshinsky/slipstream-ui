import React, { forwardRef, ReactNode, HTMLAttributes } from 'react';
import clsx from 'clsx';

export type TForm = HTMLAttributes<HTMLFormElement> & {
  className?: string;
  children?: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Form = forwardRef<HTMLFormElement, TForm>((props, ref) => {
  const { className, children, onSubmit, ...attrs } = props;

  const classes = clsx('sui--form', className);

  return (
    <form ref={ref} className={classes} onSubmit={onSubmit} {...attrs}>
      {children}
    </form>
  );
});

Form.displayName = 'Form';

export default Form;
