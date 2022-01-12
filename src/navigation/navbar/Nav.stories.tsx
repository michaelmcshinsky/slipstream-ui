import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Nav as NavComponent, NavProps } from '../../';

export default {
  title: 'Components/Navigation/Nav',
  component: NavComponent,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<NavProps> = ({ ...args }) => (
  <>
    <NavComponent {...args}>
      <NavComponent.Bar className="justify-between h-16">
        <NavComponent.Brand>
          <img
            className="w-8 h-8"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
            alt="Workflow"
          />
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
      <NavComponent.Menu absolute>
        <NavComponent.List>
          <NavComponent.Text>Navigation Text</NavComponent.Text>
          <NavComponent.Link active>Dashboard</NavComponent.Link>
          <NavComponent.Link>Projects</NavComponent.Link>
          <NavComponent.Divider/>
          <NavComponent.Link>Calendar</NavComponent.Link>
          <NavComponent.Link>Reports</NavComponent.Link>
        </NavComponent.List>
      </NavComponent.Menu>
      <NavComponent.Sidebar>
        asdf
      </NavComponent.Sidebar>
    </NavComponent>
    Text under the navigation
  </>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Nav = Template.bind({});

Nav.args = {};
