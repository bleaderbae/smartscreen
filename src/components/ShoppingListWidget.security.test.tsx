import { render, fireEvent, screen } from '@testing-library/react';
import { it, expect, describe, beforeEach } from 'vitest';
import ShoppingListWidget from './ShoppingListWidget';

describe('ShoppingListWidget Security', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('enforces maximum input length', () => {
    render(<ShoppingListWidget />);

    // Open add form
    fireEvent.click(screen.getByRole('button', { name: /Add item/i }));

    const input = screen.getByRole('textbox', { name: /New item name/i });

    // Check if maxLength attribute is present
    expect(input).toHaveAttribute('maxLength', '50');

    // Try to type a long string (JSDOM might allow it, but we also test the logic)
    const longString = 'a'.repeat(60);
    fireEvent.change(input, { target: { value: longString } });

    // Submit
    const confirmButton = screen.getByRole('button', { name: /Confirm add item/i });
    fireEvent.click(confirmButton);

    // If logic truncates, we expect 50 chars. If it rejects, we expect nothing.
    // Let's assume we implement truncation for robustness.
    const expected = 'a'.repeat(50);
    expect(screen.queryByText(longString)).not.toBeInTheDocument();

    // We can check if the truncated version exists, or just that the long one doesn't.
    // Ideally we want to prevent adding > 50 chars.
  });

  it('prevents adding too many items (DoS protection)', () => {
    // Fill localStorage with 100 items
    const manyItems = Array.from({ length: 100 }, (_, i) => ({
      id: `item-${i}`,
      text: `Item ${i}`,
      completed: false
    }));
    localStorage.setItem('shopping-list', JSON.stringify(manyItems));

    render(<ShoppingListWidget />);

    // Verify we have 100 items (using exact match to avoid matching the "Remove Item X" buttons)
    expect(screen.getAllByRole('button', { name: /^Item \d+$/ }).length).toBe(100);

    // Try to add one more
    fireEvent.click(screen.getByRole('button', { name: /Add item/i }));
    const input = screen.getByRole('textbox', { name: /New item name/i });
    fireEvent.change(input, { target: { value: 'Overflow Item' } });
    fireEvent.click(screen.getByRole('button', { name: /Confirm add item/i }));

    // Should NOT be added
    expect(screen.queryByText('Overflow Item')).not.toBeInTheDocument();
  });
});
