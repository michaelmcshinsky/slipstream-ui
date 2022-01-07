import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { Checkbox, CheckboxProps } from '../checkbox';

export type RadioProps = CheckboxProps

export const Radio = forwardRef<HTMLLabelElement, RadioProps>((props, ref) => {
  const { className, ...attrs } = props;

  const classes = classNames(
    'sui--radio',
    `sui--radio-color_${attrs.color}`,
    className,
  );

  return <Checkbox ref={ref} className={classes} {...attrs} type="radio" />;
});

Radio.displayName = 'Radio';

export default Radio;
