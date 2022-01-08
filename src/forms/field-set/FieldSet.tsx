import React, { ReactNode } from 'react';
import classNames from 'classnames';

export interface FieldSetProps {
  styles?: object;
  className?: string;
  children: ReactNode;
  custom?: boolean;
}

export function FieldSet({
  className,
  styles,
  children,
  custom,
}: FieldSetProps) {
  const classes = classNames(
    'sui--fieldset',
    !custom && 'block py-2 px-3 border border-solid border-gray-300',
    className,
  );

  const fieldsetStyles = !custom
    ? {
        marginInlineStart: '2px',
        marginInlineEnd: '2px',
        ...styles,
      }
    : { ...styles };

  return (
    <fieldset style={fieldsetStyles} className={classes}>
      {children}
    </fieldset>
  );
}

FieldSet.displayName = 'FieldSet';

export default FieldSet;
