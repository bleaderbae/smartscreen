import { render, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Clock from './components/Clock';
import * as Lucide from 'lucide-react';

// Mock Lucide icons to count renders
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof Lucide>();
  // We mock Sunrise because it is always rendered in the legend
  return {
    ...actual,
    Sunrise: vi.fn((props) => <div data-testid="sunrise-icon" {...props} />),
  };
});

describe('Clock Performance', () => {
  beforeEach(() => {
     vi.useFakeTimers();
     // Set time to 10:00 AM
     const date = new Date(2024, 0, 1, 10, 0, 0);
     vi.setSystemTime(date);
  });

  afterEach(() => {
     vi.useRealTimers();
     vi.restoreAllMocks();
  });

  it('renders only when minute changes (optimized)', async () => {
    render(<Clock />);

    // Initial render
    // Sunrise should be called once
    expect(vi.mocked(Lucide.Sunrise)).toHaveBeenCalledTimes(1);

    // Advance 1s
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Should NOT be called again (still 1)
    expect(vi.mocked(Lucide.Sunrise)).toHaveBeenCalledTimes(1);

    // Advance another 1s
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Should NOT be called again (still 1)
    expect(vi.mocked(Lucide.Sunrise)).toHaveBeenCalledTimes(1);

    // Advance by 60s (minute changes)
    await act(async () => {
      vi.advanceTimersByTime(60000);
    });

    // Should render again (total 2)
    expect(vi.mocked(Lucide.Sunrise)).toHaveBeenCalledTimes(2);
  });
});
