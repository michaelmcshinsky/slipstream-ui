import * as React from 'react';

export const ChevronDown = ({
  fill,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 10 14"
    {...props}
  >
    <path
      fill={fill}
      fill-rule="evenodd"
      d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6z"
    />
  </svg>
);

ChevronDown.defaultProps = {
  fill: '#000',
};
