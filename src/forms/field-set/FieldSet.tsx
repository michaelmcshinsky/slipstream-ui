import React, { ReactNode } from 'react';
import classNames from 'classnames';

export interface FieldSetProps {
  styles?: object;
  className?: string;
  children?: ReactNode;
}

export function FieldSet({ className, styles, children }: FieldSetProps) {
  const classes = classNames(
    'sui--fieldset',
    'block py-2 px-3 border border-solid border-gray-300',
    className,
  );

  const fieldsetStyles = {
    marginInlineStart: '2px',
    marginInlineEnd: '2px',
    ...styles,
  };

  return (
    <fieldset style={fieldsetStyles} className={classes}>
      {children}
    </fieldset>
  );
}

export default FieldSet;
