import { render, fireEvent, screen } from '@testing-library/react';
import { it, expect, describe, beforeEach } from 'vitest';
import ShoppingListWidget from './ShoppingListWidget';

describe('ShoppingListWidget Security', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('enforces maximum item length', () => {
    render(<ShoppingListWidget />);

    // Open add form
    fireEvent.click(screen.getByRole('button', { name: /Add item/i }));

    const input = screen.getByRole('textbox', { name: /New item name/i });
    const longText = 'a'.repeat(60); // 60 chars, assuming limit will be 50

    fireEvent.change(input, { target: { value: longText } });

    // The input value should be truncated or validation should prevent submission
    // For now, let's assume we want to truncate input value or stop submission.
    // Let's check if the input attribute 'maxLength' is set.
    expect(input).toHaveAttribute('maxLength', '50');
  });

  it('enforces maximum number of items', () => {
    // Pre-fill localStorage with 100 items
    const manyItems = Array.from({ length: 100 }, (_, i) => ({
      id: `id-${i}`,
      text: `Item ${i}`,
      completed: false
    }));
    localStorage.setItem('shopping-list', JSON.stringify(manyItems));

    render(<ShoppingListWidget />);

    // Try to add one more
    fireEvent.click(screen.getByRole('button', { name: /Add item/i }));
    const input = screen.getByRole('textbox', { name: /New item name/i });
    fireEvent.change(input, { target: { value: 'One more thing' } });

    const submitButton = screen.getByRole('button', { name: /Confirm add item/i });

    // Should be disabled or click should not add
    // Let's assume we disable the add button or show an error
    // For this test, let's check if the button is disabled or if the list size remains 100

    // If the UI is well-designed, it might disable the "Add item" button entirely if full.
    // Or disable the submit button.

    // Let's simulate a click and check list size.
    fireEvent.click(submitButton);

    // Re-query items
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(100);
  });
});
