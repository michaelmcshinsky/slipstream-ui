import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { CardBody, TCardBody } from './CardBody';
import { CardFooter, TCardFooter } from './CardFooter';
import { CardHeader, TCardHeader } from './CardHeader';
import { CardTitle, TCardTitle } from './CardTitle';
import { renderedChildren } from './utils';

export type TCard = {
  border?: boolean;
  children?: ReactNode;
  className?: string;
  custom?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

type CardComponent = React.ForwardRefExoticComponent<
  TCard & React.RefAttributes<HTMLDivElement>
> & {
  Body: React.ForwardRefExoticComponent<
    TCardBody & React.RefAttributes<HTMLDivElement>
  >;
  Footer: React.ForwardRefExoticComponent<
    TCardFooter & React.RefAttributes<HTMLDivElement>
  >;
  Header: React.ForwardRefExoticComponent<
    TCardHeader & React.RefAttributes<HTMLDivElement>
  >;
  Title: React.ForwardRefExoticComponent<
    TCardTitle & React.RefAttributes<HTMLDivElement>
  >;
};

export const Card = forwardRef<HTMLDivElement, TCard>(
  ({ className, size, border, children, custom, ...props }, ref) => {
    const classes = clsx(
      'sui--card',
      'w-full',
      !custom && ['border border-solid rounded', 'border-gray-300'],
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {renderedChildren({ border, children, size })}
      </div>
    );
  }
) as CardComponent;

Card.displayName = 'Card';
Card.defaultProps = {
  border: false,
};

Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Header = CardHeader;
Card.Title = CardTitle;

export default Card;
