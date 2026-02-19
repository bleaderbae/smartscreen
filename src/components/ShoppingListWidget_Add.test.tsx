import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShoppingListWidget from './ShoppingListWidget';

describe('ShoppingListWidget Add Item', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reveals input field when clicking the add button', () => {
    render(<ShoppingListWidget />);

    // Initially input should not be visible
    expect(screen.queryByPlaceholderText('What do you need?')).not.toBeInTheDocument();

    // Click add button
    const addButton = screen.getByRole('button', { name: /Add item/i });
    fireEvent.click(addButton);

    // Input should be visible
    expect(screen.getByPlaceholderText('What do you need?')).toBeInTheDocument();

    // Button label should change to "Cancel add"
    expect(screen.getByRole('button', { name: /Cancel add/i })).toBeInTheDocument();
  });

  it('adds a new item when submitting the form', () => {
    render(<ShoppingListWidget />);

    // Open add form
    fireEvent.click(screen.getByRole('button', { name: /Add item/i }));

    // Type "Bananas"
    const input = screen.getByPlaceholderText('What do you need?');
    fireEvent.change(input, { target: { value: 'Bananas' } });

    // Submit form (click confirm button)
    const confirmButton = screen.getByRole('button', { name: /Confirm add item/i });
    fireEvent.click(confirmButton);

    // "Bananas" should be in the list
    expect(screen.getByRole('button', { name: /Toggle Bananas/i })).toBeInTheDocument();

    // Form should close
    expect(screen.queryByPlaceholderText('What do you need?')).not.toBeInTheDocument();
  });

  it('adds a new item when pressing Enter', () => {
    render(<ShoppingListWidget />);

    // Open add form
    fireEvent.click(screen.getByRole('button', { name: /Add item/i }));

    // Type "Oranges" and press Enter
    const input = screen.getByPlaceholderText('What do you need?');
    fireEvent.change(input, { target: { value: 'Oranges' } });
    fireEvent.submit(input.closest('form')!);

    // "Oranges" should be in the list
    expect(screen.getByRole('button', { name: /Toggle Oranges/i })).toBeInTheDocument();
  });

  it('disables add button when input is empty', () => {
    render(<ShoppingListWidget />);

    // Open add form
    fireEvent.click(screen.getByRole('button', { name: /Add item/i }));

    // Confirm button should be disabled initially
    const confirmButton = screen.getByRole('button', { name: /Confirm add item/i });
    expect(confirmButton).toBeDisabled();

    // Type something
    const input = screen.getByPlaceholderText('What do you need?');
    fireEvent.change(input, { target: { value: '  ' } }); // Whitespace only
    expect(confirmButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'Bread' } });
    expect(confirmButton).not.toBeDisabled();
  });
});
