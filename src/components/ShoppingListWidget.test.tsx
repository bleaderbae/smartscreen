import { render, fireEvent, screen, within } from '@testing-library/react';
import { it, expect, describe, beforeEach } from 'vitest';
import ShoppingListWidget from './ShoppingListWidget';

describe('ShoppingListWidget', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders default shopping items', () => {
    render(<ShoppingListWidget />);
    // Check for items in the list (using specific item name as label)
    expect(screen.getByRole('button', { name: /^Milk$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Avocados$/i })).toBeInTheDocument();
  });

  it('renders quick add menu', () => {
    render(<ShoppingListWidget />);
    expect(screen.getByText(/Quick Add/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Quick add Milk/i })).toBeInTheDocument();
  });

  it('toggles item completion state on click', () => {
    render(<ShoppingListWidget />);
    const itemButton = screen.getByRole('button', { name: /^Milk$/i });
    const itemText = within(itemButton).getByText('Milk');
    
    // Initially not completed
    expect(itemText).not.toHaveClass('line-through');
    expect(itemButton).toHaveAttribute('aria-pressed', 'false');

    // Click to toggle
    fireEvent.click(itemButton);
    expect(itemText).toHaveClass('line-through');
    expect(itemButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('adds an item via quick add', () => {
    render(<ShoppingListWidget />);
    
    // Check Eggs isn't in the active list initially
    expect(screen.queryByRole('button', { name: /^Eggs$/i })).not.toBeInTheDocument();

    // Click \"Eggs\" in the Quick Add menu
    const eggButton = screen.getByRole('button', { name: /Quick add Eggs/i });
    fireEvent.click(eggButton);

    // Now it should be in the list
    expect(screen.getByRole('button', { name: /^Eggs$/i })).toBeInTheDocument();
  });

  it('prevents duplicate active items from quick add', () => {
    render(<ShoppingListWidget />);
    
    // Milk is already there. Clicking quick add should not add another.
    const milkQuickAdd = screen.getByRole('button', { name: /Quick add Milk/i });
    fireEvent.click(milkQuickAdd);

    const milkListItems = screen.getAllByRole('button', { name: /^Milk$/i });
    expect(milkListItems.length).toBe(1);
  });

  it('toggles the add item form when the plus button is clicked', () => {
    render(<ShoppingListWidget />);

    // Initially, the input should not be visible
    expect(screen.queryByRole('textbox', { name: /New item name/i })).not.toBeInTheDocument();

    // Click the \"Add item\" button
    const addButton = screen.getByRole('button', { name: /Add item/i });
    fireEvent.click(addButton);

    // Now the input should be visible
    const input = screen.getByRole('textbox', { name: /New item name/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();

    // Click it again to close (cancel)
    // Note: The aria-label changes to \"Cancel adding item\"
    const cancelButton = screen.getByRole('button', { name: /Cancel adding item/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByRole('textbox', { name: /New item name/i })).not.toBeInTheDocument();
  });

  it('adds a new item when submitted via button', () => {
    render(<ShoppingListWidget />);

    // Open add form
    fireEvent.click(screen.getByRole('button', { name: /Add item/i }));

    // Type \"Sourdough Bread\"
    const input = screen.getByRole('textbox', { name: /New item name/i });
    fireEvent.change(input, { target: { value: 'Sourdough Bread' } });

    // Submit
    const confirmButton = screen.getByRole('button', { name: /Confirm add item/i });
    fireEvent.click(confirmButton);

    // Form should close
    expect(screen.queryByRole('textbox', { name: /New item name/i })).not.toBeInTheDocument();

    // Item should be in the list
    expect(screen.getByRole('button', { name: /^Sourdough Bread$/i })).toBeInTheDocument();
  });

  it('adds a new item when submitted via Enter key', () => {
    render(<ShoppingListWidget />);

    // Open add form
    fireEvent.click(screen.getByRole('button', { name: /Add item/i }));

    // Type \"Almond Milk\" and hit Enter
    const input = screen.getByRole('textbox', { name: /New item name/i });
    fireEvent.change(input, { target: { value: 'Almond Milk' } });
    fireEvent.submit(input.closest('form')!);

    // Item should be in the list
    expect(screen.getByRole('button', { name: /^Almond Milk$/i })).toBeInTheDocument();
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('shopping-list', 'INVALID_JSON{');

    // This should not throw an error and render default items or empty list
    render(<ShoppingListWidget />);
    // If it renders, check for default items (Milk)
    expect(screen.getAllByText('Milk').length).toBeGreaterThan(0);
  });
});
