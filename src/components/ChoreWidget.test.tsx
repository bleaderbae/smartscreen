import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChoreWidget from './ChoreWidget';
import { Circle } from 'lucide-react';

describe('ChoreWidget', () => {
  const mockToggle = vi.fn();
  const defaultProps = {
    id: '1',
    text: 'Walk the dog',
    icon: Circle,
    color: 'blue',
    completed: false,
    onToggle: mockToggle,
    frequency: 'daily' as const,
  };

  beforeEach(() => {
    mockToggle.mockClear();
  });

  it('renders chore text', () => {
    render(<ChoreWidget {...defaultProps} />);
    expect(screen.getByText('Walk the dog')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', () => {
    render(<ChoreWidget {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockToggle).toHaveBeenCalledWith('1');
  });

  it('calls onToggle when Enter key is pressed', () => {
    render(<ChoreWidget {...defaultProps} />);
    const widget = screen.getByRole('button');
    fireEvent.keyDown(widget, { key: 'Enter', code: 'Enter' });
    expect(mockToggle).toHaveBeenCalledWith('1');
  });

  it('calls onToggle when Space key is pressed', () => {
    render(<ChoreWidget {...defaultProps} />);
    const widget = screen.getByRole('button');
    fireEvent.keyDown(widget, { key: ' ', code: 'Space' });
    expect(mockToggle).toHaveBeenCalledWith('1');
  });

  it('has correct aria-label and aria-pressed attributes', () => {
    const { rerender } = render(<ChoreWidget {...defaultProps} />);
    let widget = screen.getByRole('button');

    expect(widget).toHaveAttribute('aria-label', expect.stringContaining('Mark Walk the dog as complete'));
    expect(widget).toHaveAttribute('aria-pressed', 'false');

    rerender(<ChoreWidget {...defaultProps} completed={true} />);
    widget = screen.getByRole('button');
    expect(widget).toHaveAttribute('aria-label', expect.stringContaining('Mark Walk the dog as incomplete'));
    expect(widget).toHaveAttribute('aria-pressed', 'true');
  });
});
