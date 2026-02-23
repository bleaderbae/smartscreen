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
    // Milk is in default list, so it will be "Milk (Added)"
    expect(screen.getByRole('button', { name: /Milk \(Added\)/i })).toBeInTheDocument();
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
    
    // Milk is already in the list (default state).
    // The Quick Add button should be disabled and have updated label.
    const milkQuickAdd = screen.getByRole('button', { name: /Milk \(Added\)/i });

    expect(milkQuickAdd).toBeInTheDocument();
    expect(milkQuickAdd).toBeDisabled();

    // Clicking it should not do anything
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

  it('shows clear completed button only when there are completed items', () => {
    render(<ShoppingListWidget />);

    // Initially no items are completed (based on default state in test)
    // Actually, default state has completed: false for all items.
    expect(screen.queryByRole('button', { name: /Clear Completed/i })).not.toBeInTheDocument();

    // Toggle an item to complete
    const milkButton = screen.getByRole('button', { name: /^Milk$/i });
    fireEvent.click(milkButton);

    // Now the button should appear
    expect(screen.getByRole('button', { name: /Clear Completed/i })).toBeInTheDocument();

    // Toggle back to incomplete
    fireEvent.click(milkButton);

    // Button should disappear
    expect(screen.queryByRole('button', { name: /Clear Completed/i })).not.toBeInTheDocument();
  });

  it('clears completed items when button is clicked', () => {
    render(<ShoppingListWidget />);

    // Complete Milk
    const milkButton = screen.getByRole('button', { name: /^Milk$/i });
    fireEvent.click(milkButton);

    // Click Clear Completed
    const clearButton = screen.getByRole('button', { name: /Clear Completed/i });
    fireEvent.click(clearButton);

    // Milk should be gone
    expect(screen.queryByRole('button', { name: /^Milk$/i })).not.toBeInTheDocument();

    // Avocados (incomplete) should still be there
    expect(screen.getByRole('button', { name: /^Avocados$/i })).toBeInTheDocument();
  });

  it('shows empty state when all items are removed', () => {
    render(<ShoppingListWidget />);

    // Remove all items one by one
    // Note: Default items are Milk, Avocados, Whole Grain Bread
    const removeButtons = screen.getAllByRole('button', { name: /Remove/i });
    removeButtons.forEach(btn => fireEvent.click(btn));

    // List should be empty
    expect(screen.queryByRole('button', { name: /^Milk$/i })).not.toBeInTheDocument();

    // Empty state should be visible
    expect(screen.getByText(/Your list is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/Add items above/i)).toBeInTheDocument();
  });

  it('handles localStorage containing valid JSON but invalid schema (not an array)', () => {
    localStorage.setItem('shopping-list', '{"foo": "bar"}');

    // This should NOT crash now
    render(<ShoppingListWidget />);

    // Check if default items are rendered (fallback logic)
    expect(screen.getAllByText('Milk').length).toBeGreaterThan(0);
  });
});
