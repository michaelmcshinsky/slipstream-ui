import React, { ReactNode } from 'react';
import classNames from 'classnames';

export interface HeadingProps {
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  custom?: boolean;
  children: ReactNode;
}

export function Heading(props: HeadingProps) {
  const { level: Tag, custom, className, children, ...attrs } = props;
  const classes = classNames(
    !custom && Tag === 'h1' && 'text-3xl',
    !custom && Tag === 'h2' && 'text-2xl',
    !custom && Tag === 'h3' && 'text-xl',
    !custom && Tag === 'h4' && 'text-lg',
    !custom && Tag === 'h5' && 'text-base',
    !custom && Tag === 'h6' && 'text-sm',
    className
  );
  return (
    <Tag {...attrs} className={classes}>
      {children}
    </Tag>
  );
}

Heading.defaultProps = {
  level: 'h2',
  custom: false,
};

export default Heading;
