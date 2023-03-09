import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { Checkbox, TCheckbox } from '../checkbox';

export type TRadio = TCheckbox;

export const Radio = forwardRef<HTMLLabelElement, TRadio>(
  ({ className, color, ...props }, ref) => {
    const classes = clsx('sui--radio', `sui--radio-color_${color}`, className);

    return <Checkbox ref={ref} className={classes} {...props} type="radio" />;
  }
);

Radio.displayName = 'Radio';

export default Radio;
