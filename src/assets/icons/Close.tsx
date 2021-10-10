import * as React from 'react';

export const Close = ({
  stroke,
  fill,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    viewBox="0 0 24 24"
    stroke={stroke}
    {...props}
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

Close.defaultProps = {
  stroke: 'currentColor',
  fill: 'none',
};
