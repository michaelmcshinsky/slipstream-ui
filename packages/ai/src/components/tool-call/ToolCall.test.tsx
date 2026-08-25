import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ToolCall } from './ToolCall';

const toolCall = {
  id: 'call_1',
  name: 'get_weather',
  arguments: { city: 'Paris' },
  result: { temp: 21 },
  status: 'completed' as const,
};

describe('ToolCall', () => {
  it('renders the tool name, id, and status', () => {
    render(<ToolCall toolCall={toolCall} />);
    expect(screen.getByText('get_weather')).toBeInTheDocument();
    expect(screen.getByText('call_1')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it.each(['pending', 'running', 'failed'] as const)('labels the %s status', (status) => {
    const labels = { pending: 'Pending', running: 'Running', failed: 'Failed' };
    render(<ToolCall toolCall={{ ...toolCall, result: undefined, status }} />);
    expect(screen.getByText(labels[status])).toBeInTheDocument();
  });

  it('serializes arguments as JSON', () => {
    render(<ToolCall toolCall={toolCall} />);
    expect(screen.getByText(/"city":\s*"Paris"/)).toBeInTheDocument();
  });

  it('shows the result when present and hides it with showResult=false', () => {
    const { rerender } = render(<ToolCall toolCall={{ ...toolCall, result: 'Done' }} />);
    expect(screen.getByText('Done')).toBeInTheDocument();

    rerender(<ToolCall toolCall={toolCall} showResult={false} />);
    expect(screen.queryByText(/"temp"/)).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ToolCall toolCall={toolCall} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
