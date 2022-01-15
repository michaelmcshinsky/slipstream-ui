import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Nav as NavComponent, NavProps, Text, SlipstreamProvider } from '../../';

export default {
  title: 'Components/Navigation/Nav',
  component: NavComponent,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<NavProps> = ({ ...args }) => (
  <SlipstreamProvider dark>
    <div>
      <NavComponent {...args} disableScroll>
        <NavComponent.Bar className="justify-between h-16">
          <NavComponent.Brand>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8"
              viewBox="0 0 150 150"
            >
              <path
                id="slipstream-svg"
                fill="#2D8EFF"
                stroke="#2D8EFF"
                strokeWidth="1"
                d="M 69.02,8.34
            C 74.82,4.64 81.00,7.36 74.45,15.18
              69.13,21.88 56.98,30.99 62.82,43.55
              69.94,54.69 96.96,65.27 109.00,72.45
              116.80,77.10 124.69,83.95 123.66,94.00
              122.24,107.86 96.27,135.91 86.00,142.29
              81.36,145.36 78.64,140.45 81.27,136.00
              85.73,126.45 94.85,120.46 88.77,110.00
              87.72,108.18 86.35,106.54 84.91,105.02
              77.51,97.17 58.29,88.72 48.00,84.28
              41.86,81.63 32.62,78.14 28.44,72.96
              22.83,66.15 24.67,56.17 28.44,49.00
              34.87,37.03 40.27,32.94 49.55,23.91
              54.64,18.95 62.27,12.64 69.02,8.34 Z"
              />
            </svg>
          </NavComponent.Brand>
          <NavComponent.Collapse>
            <NavComponent.List right>
              <NavComponent.Link>Dashboard</NavComponent.Link>
              <NavComponent.Link>Projects</NavComponent.Link>
              <NavComponent.Link>Calendar</NavComponent.Link>
              <NavComponent.Link>Reports</NavComponent.Link>
            </NavComponent.List>
          </NavComponent.Collapse>
          <NavComponent.Toggler />
        </NavComponent.Bar>
        <NavComponent.Menu offCanvas>
          <NavComponent.List>
            <NavComponent.Text>Navigation Text</NavComponent.Text>
            <NavComponent.Link active>Dashboard</NavComponent.Link>
            <NavComponent.Link>Projects</NavComponent.Link>
            <NavComponent.Divider />
            <NavComponent.Link>Calendar</NavComponent.Link>
            <NavComponent.Link>Reports</NavComponent.Link>
          </NavComponent.List>
        </NavComponent.Menu>
        {/* <NavComponent.Sidebar full className="p-3">
          <h1>Menu</h1>
        </NavComponent.Sidebar> */}
      </NavComponent>
      <Text>Text under the navigation</Text>
    </div>
  </SlipstreamProvider>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Nav = Template.bind({});

Nav.args = {};
