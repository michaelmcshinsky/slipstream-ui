import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';
import { CardBody, CardBodyProps } from './CardBody';
import { CardFooter, CardFooterProps } from './CardFooter';
import { CardHeader, CardHeaderProps } from './CardHeader';
import { CardTitle, CardTitleProps } from './CardTitle';
import { renderedChildren } from './utils';

export interface CardProps {
  border?: boolean;
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface CardComponent
  extends React.ForwardRefExoticComponent<
    CardProps & React.RefAttributes<HTMLDivElement>
  > {
  Body: React.ForwardRefExoticComponent<
    CardBodyProps & React.RefAttributes<HTMLDivElement>
  >;
  Footer: React.ForwardRefExoticComponent<
    CardFooterProps & React.RefAttributes<HTMLDivElement>
  >;
  Header: React.ForwardRefExoticComponent<
    CardHeaderProps & React.RefAttributes<HTMLDivElement>
  >;
  Title: React.ForwardRefExoticComponent<
    CardTitleProps & React.RefAttributes<HTMLDivElement>
  >;
}

export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { className, size, border, children, ...attributes } = props;
  const classes = classnames(
    'sui--card',
    'border border-solid rounded w-full',
    'border-gray-300 dark:bg-gray-900 dark:border-gray-500',
    className
  );

  return (
    <div ref={ref} className={classes} {...attributes}>
      {renderedChildren({ border, children, size })}
    </div>
  );
}) as CardComponent;

Card.displayName = 'Card';
Card.defaultProps = {
  border: false,
};

Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Header = CardHeader;
Card.Title = CardTitle;

export default Card;
