import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload } from './FileUpload';

function file(name: string, size = 4) {
  return new File([new Uint8Array(size)], name, { type: 'text/plain' });
}

describe('FileUpload', () => {
  it('lists selected files and reports changes', async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    render(<FileUpload aria-label="Attachments" onFilesChange={onFilesChange} />);
    await user.upload(screen.getByLabelText(/Drop files here/), [file('a.txt'), file('b.txt')]);
    expect(onFilesChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText('a.txt')).toBeInTheDocument();
    expect(screen.getByText('b.txt')).toBeInTheDocument();
  });

  it('removes a file and shows progress', async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    render(
      <FileUpload
        aria-label="Uploads"
        defaultFiles={[file('report.pdf')]}
        progress={{ 'report.pdf': 42 }}
        onFilesChange={onFilesChange}
      />
    );
    expect(screen.getByRole('progressbar', { name: 'Uploading report.pdf' })).toHaveAttribute('aria-valuenow', '42');
    await user.click(screen.getByRole('button', { name: 'Remove report.pdf' }));
    expect(onFilesChange).toHaveBeenCalledWith([]);
    expect(screen.queryByText('report.pdf')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<FileUpload aria-label="Files" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
