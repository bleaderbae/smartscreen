import { render, fireEvent, screen } from '@testing-library/react';
import { it, expect, describe, beforeEach } from 'vitest';
import ShoppingListWidget from './ShoppingListWidget';

describe('ShoppingListWidget UX', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows inline error and keeps form open when adding duplicate', () => {
    render(<ShoppingListWidget />);

    // "Milk" is in default list
    expect(screen.getByRole('button', { name: /^Milk$/i })).toBeInTheDocument();

    // Open add form
    fireEvent.click(screen.getByRole('button', { name: /Add item/i }));

    // Type "Milk"
    const input = screen.getByRole('textbox', { name: /New item name/i });
    fireEvent.change(input, { target: { value: 'Milk' } });

    // Submit
    const confirmButton = screen.getByRole('button', { name: /Confirm add item/i });
    fireEvent.click(confirmButton);

    // Expect form to remain OPEN
    expect(screen.getByRole('textbox', { name: /New item name/i })).toBeInTheDocument();

    // Expect error message
    expect(screen.getByText('Already on your list!')).toBeInTheDocument();

    // Expect "Milk" count to remain 1 (no duplicate added)
    expect(screen.getAllByRole('button', { name: /^Milk$/i }).length).toBe(1);

    // UX: Typing should clear the error
    fireEvent.change(input, { target: { value: 'Milk 2' } });
    expect(screen.queryByText('Already on your list!')).not.toBeInTheDocument();

    // Submit valid item
    fireEvent.click(confirmButton);

    // Form should close now
    expect(screen.queryByRole('textbox', { name: /New item name/i })).not.toBeInTheDocument();

    // Item should be added
    expect(screen.getByRole('button', { name: /^Milk 2$/i })).toBeInTheDocument();
  });
});
