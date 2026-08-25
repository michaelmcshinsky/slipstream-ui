import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Attachment } from './Attachment';
import { AttachmentList } from './AttachmentList';

describe('Attachment', () => {
  it('renders the file name and size', () => {
    render(<Attachment attachment={{ id: '1', name: 'spec.pdf', size: '2.4 MB', type: 'PDF' }} />);
    expect(screen.getByText('spec.pdf')).toBeInTheDocument();
    expect(screen.getByText(/2.4 MB/)).toBeInTheDocument();
  });

  it('shows an uploading status', () => {
    render(<Attachment attachment={{ id: '1', name: 'big.zip', status: 'uploading' }} />);
    expect(screen.getByRole('status', { name: 'Uploading' })).toBeInTheDocument();
  });

  it('renders a thumbnail preview when provided', () => {
    const { container } = render(
      <Attachment
        attachment={{ id: '1', name: 'chart.png', previewUrl: '/chart.png' }}
      />
    );
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', '/chart.png');
    // Decorative: the file name carries the meaning.
    expect(img).toHaveAttribute('aria-hidden', 'true');
  });

  it('calls onRemove with the attachment', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const attachment = { id: '1', name: 'notes.txt' };
    render(<Attachment attachment={attachment} onRemove={onRemove} />);
    await user.click(screen.getByRole('button', { name: 'Remove notes.txt' }));
    expect(onRemove).toHaveBeenCalledWith(attachment);
  });

  it('hides the remove control without onRemove', () => {
    render(<Attachment attachment={{ id: '1', name: 'notes.txt' }} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Attachment attachment={{ id: '1', name: 'spec.pdf', size: '2.4 MB' }} onRemove={() => {}} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('AttachmentList', () => {
  it('renders every attachment', () => {
    render(
      <AttachmentList
        attachments={[
          { id: '1', name: 'a.pdf' },
          { id: '2', name: 'b.png' },
        ]}
      />
    );
    expect(screen.getByText('a.pdf')).toBeInTheDocument();
    expect(screen.getByText('b.png')).toBeInTheDocument();
  });

  it('renders nothing for an empty list', () => {
    const { container } = render(<AttachmentList attachments={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
