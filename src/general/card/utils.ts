import React, { ReactNode } from 'react';

export type Params = {
  border?: boolean;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function renderedChildren({ border, children, size }: Params) {
  return React.Children.toArray(children)
    .filter(Boolean)
    .map((child: any) => {
      switch (child?.type?.displayName) {
        case 'CardHeader':
        case 'CardFooter':
          return React.cloneElement(child, {
            border,
            size,
          });
        case 'Card':
        case 'CardTitle':
        case 'CardBody':
          return React.cloneElement(child, {
            size,
          });
        default:
          return child;
      }
    });
}
