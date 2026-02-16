import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChoreWidget from './ChoreWidget';
import { Sparkles } from 'lucide-react';

describe('ChoreWidget', () => {
  const mockChore = {
    id: 'test-chore-1',
    text: 'Do Laundry',
    icon: Sparkles,
    color: 'blue',
    completed: false,
    frequency: 'daily' as const,
    assignedTo: 'Dad',
    onToggle: vi.fn(),
  };

  it('renders chore text and frequency', () => {
    render(<ChoreWidget {...mockChore} />);
    expect(screen.getByText('Do Laundry')).toBeInTheDocument();
    expect(screen.getByText('daily')).toBeInTheDocument();
    expect(screen.getByText('Dad')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(<ChoreWidget {...{ ...mockChore, onToggle }} />);
    const widget = screen.getByRole('button');
    fireEvent.click(widget);
    expect(onToggle).toHaveBeenCalledWith('test-chore-1');
  });

  it('has accessible attributes', () => {
    render(<ChoreWidget {...mockChore} />);
    const widget = screen.getByRole('button');
    expect(widget).toHaveAttribute('tabIndex', '0');
    expect(widget).toHaveAttribute('aria-label', expect.stringContaining('Do Laundry'));
    expect(widget).toHaveAttribute('aria-pressed', 'false');
  });

  it('handles keyboard interaction (Enter)', () => {
    const onToggle = vi.fn();
    render(<ChoreWidget {...{ ...mockChore, onToggle }} />);
    const widget = screen.getByRole('button');
    widget.focus();
    fireEvent.keyDown(widget, { key: 'Enter', code: 'Enter' });
    expect(onToggle).toHaveBeenCalledWith('test-chore-1');
  });

  it('handles keyboard interaction (Space)', () => {
    const onToggle = vi.fn();
    render(<ChoreWidget {...{ ...mockChore, onToggle }} />);
    const widget = screen.getByRole('button');
    widget.focus();
    fireEvent.keyDown(widget, { key: ' ', code: 'Space' });
    expect(onToggle).toHaveBeenCalledWith('test-chore-1');
  });
});
