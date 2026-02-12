import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import DailyFeedWidget from './DailyFeedWidget';
import * as service from '../services/dailyFeedService';

vi.mock('../services/dailyFeedService', () => ({
  getNASAData: vi.fn(),
  getDogData: vi.fn(),
}));

describe('DailyFeedWidget', () => {
  const mockNasa = {
    id: 'nasa-1',
    type: 'nasa' as const,
    title: 'Space Title',
    url: 'space.jpg',
    explanation: 'Space desc'
  };

  const mockDog = {
    id: 'dog-1',
    type: 'dog' as const,
    title: 'Dog Title',
    url: 'dog.jpg',
    explanation: 'Dog desc'
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(service.getNASAData).mockResolvedValue(mockNasa);
    vi.mocked(service.getDogData).mockResolvedValue(mockDog);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders NASA content by default', async () => {
    render(<DailyFeedWidget />);

    await waitFor(() => {
      expect(screen.getByText('Astronomy Picture')).toBeInTheDocument();
      expect(screen.getByText('Space Title')).toBeInTheDocument();
    });
  });

  it('toggles to Dog content after timer', async () => {
    vi.useFakeTimers();
    render(<DailyFeedWidget />);

    // Allow initial load to complete (flushing microtasks for mocked service calls)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(screen.getByText('Astronomy Picture')).toBeInTheDocument();

    // Fast forward 10 minutes
    act(() => {
      vi.advanceTimersByTime(10 * 60 * 1000 + 100);
    });

    expect(screen.getByText('Daily Dog Fact')).toBeInTheDocument();
    expect(screen.getByText('Dog Title')).toBeInTheDocument();
  });

  it('opens modal on click', async () => {
    render(<DailyFeedWidget />);

    await waitFor(() => {
      expect(screen.getByText('Space Title')).toBeInTheDocument();
    });

    // Click the widget (using title as handle)
    fireEvent.click(screen.getByText('Space Title'));

    // Check for modal content
    await waitFor(() => {
      expect(screen.getByText('Space desc')).toBeInTheDocument();
      expect(screen.getByText('Image Credit: NASA APOD')).toBeInTheDocument();
    });

    // Close modal
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => {
        expect(screen.queryByText('Image Credit: NASA APOD')).not.toBeInTheDocument();
    });
  });

  it('opens modal on Enter key', async () => {
    render(<DailyFeedWidget />);

    await waitFor(() => {
      expect(screen.getByText('Space Title')).toBeInTheDocument();
    });

    const widget = screen.getByRole('button', { name: /View Astronomy Picture: Space Title/i });

    // Focus and press Enter
    widget.focus();
    fireEvent.keyDown(widget, { key: 'Enter', code: 'Enter' });

    // Check for modal content
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Space desc')).toBeInTheDocument();
    });

    // Check close button accessibility
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });
});
