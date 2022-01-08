import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';
import { CardBody, CardBodyProps } from './CardBody';
import { CardFooter, CardFooterProps } from './CardFooter';
import { CardHeader, CardHeaderProps } from './CardHeader';
import { CardTitle, CardTitleProps } from './CardTitle';

export interface CardProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  children: ReactNode;
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
  const { className, size, dark, children, ...attributes } = props;
  const classes = classnames(
    'border border-solid rounded w-full',
    { 'border-gray-300': !dark },
    { 'bg-gray-900 border-gray-500': dark },
    className,
  );

  const renderedChildren = React.Children.toArray(children)
  .filter(Boolean)
  .map((child: any) => {
    if (child?.type?.displayName?.includes?.('Card')) {
      return React.cloneElement(child, {
        size,
        dark,
      });
    }
    return child;
  });

  return (
    <div ref={ref} className={classes} {...attributes}>
      {renderedChildren}
    </div>
  );
}) as CardComponent;

Card.displayName = 'Card';
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Header = CardHeader;
Card.Title = CardTitle;

export default Card;
