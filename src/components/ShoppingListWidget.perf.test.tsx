import { render, fireEvent, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import ShoppingListWidget from './ShoppingListWidget';
import * as Lucide from 'lucide-react';

// Mock Lucide icons to count renders of Circle (used in list items)
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof Lucide>();
  return {
    ...actual,
    Circle: vi.fn((props) => <div data-testid="circle-icon" {...props} />),
  };
});

describe('ShoppingListWidget Performance', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not re-render list items when typing in the add item input', () => {
    render(<ShoppingListWidget />);

    // Initial render should show default items (3 items by default in the component)
    // Milk, Avocados, Whole Grain Bread. All uncompleted -> 3 Circles.
    // The component might re-render on mount due to useEffect/state init, but we care about the update phase.

    // Get the initial render count of Circle
    const initialRenderCount = vi.mocked(Lucide.Circle).mock.calls.length;
    expect(initialRenderCount).toBeGreaterThan(0);

    // Open the add form
    const addButton = screen.getByRole('button', { name: /Add item/i });
    fireEvent.click(addButton);

    // Get render count after opening form (this might trigger a re-render of the list too, currently)
    const countAfterOpen = vi.mocked(Lucide.Circle).mock.calls.length;

    // Type in the input
    const input = screen.getByRole('textbox', { name: /New item name/i });
    fireEvent.change(input, { target: { value: 'B' } });
    fireEvent.change(input, { target: { value: 'Ba' } });
    fireEvent.change(input, { target: { value: 'Ban' } });
    fireEvent.change(input, { target: { value: 'Bana' } });
    fireEvent.change(input, { target: { value: 'Banan' } });
    fireEvent.change(input, { target: { value: 'Banana' } });

    const finalRenderCount = vi.mocked(Lucide.Circle).mock.calls.length;

    // We expect the list items (Circles) NOT to re-render when we are just typing in the input.
    // So the count should be the same as after opening the form.
    // NOTE: This assertion is expected to FAIL before optimization.
    expect(finalRenderCount).toBe(countAfterOpen);
  });
});
