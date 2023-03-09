import * as React from 'react';
import clsx from 'clsx';

export type TSearch = React.SVGProps<SVGSVGElement> & {
  custom?: boolean;
  strokeClassName?: string;
}

export const Search = ({
  color,
  stroke,
  className,
  strokeClassName,
  custom,
  ...props
}: TSearch) => {
  const classes = clsx('sui--icon-search', className);

  const strokeClasses = clsx(
    { 'stroke-gray-400': !custom },
    strokeClassName
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill={color}
      className={classes}
      {...props}
    >
      <g transform="matrix(-1 0 0 1 10 10)">
        <g vectorEffect="non-scaling-stroke">
          <g transform="matrix(1 0 0 1 -1.5 -1.5)">
            <circle
              className={strokeClasses}
              style={{
                strokeWidth: '2',
                strokeDasharray: 'none',
                strokeLinecap: 'round',
                strokeDashoffset: '0',
                strokeLinejoin: 'round',
                fill: 'none',
                fillRule: 'nonzero',
                opacity: '1',
              }}
              cx="0"
              cy="0"
              r="7.5"
            />
          </g>
          <g transform="matrix(1 0 0 1 6.4 6.4)">
            <line
              className={strokeClasses}
              style={{
                strokeWidth: '2',
                strokeDasharray: 'none',
                strokeLinecap: 'round',
                strokeDashoffset: '0',
                strokeLinejoin: 'round',
                fill: 'none',
                fillRule: 'nonzero',
                opacity: '1',
              }}
              x1="2.5999999999999996"
              y1="2.5999999999999996"
              x2="-2.5999999999999996"
              y2="-2.5999999999999996"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

Search.defaultProps = {
  color: 'currentColor',
};
