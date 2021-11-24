import React, { ReactNode } from 'react';

export interface TextProps {
  children: ReactNode;
}

export function Text({ children, ...props }: TextProps) {
  return <p {...props}>{children}</p>;
}
