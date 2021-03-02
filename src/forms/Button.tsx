import React, { ReactNode } from 'react'

export type IButtonProps = {
  tag?: any;
  children?: ReactNode;
}

export function Button(props: IButtonProps) {
  const { tag: Tag, children, ...attrs } = props;

  return (
    <Tag {...attrs}>
      {children}
    </Tag>
  )
}

export default Button;