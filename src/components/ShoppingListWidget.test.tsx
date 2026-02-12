import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ShoppingListWidget from './ShoppingListWidget';

describe('ShoppingListWidget', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders default shopping items', () => {
    render(<ShoppingListWidget />);
    // Check for items in the list (using specific toggle label)
    expect(screen.getByRole('button', { name: /Toggle Milk/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Toggle Avocados/i })).toBeInTheDocument();
  });

  it('renders quick add menu', () => {
    render(<ShoppingListWidget />);
    expect(screen.getByText('Quick Add')).toBeInTheDocument();
    // Use specific quick add labels
    expect(screen.getByRole('button', { name: /Quick add Eggs/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Quick add Coffee/i })).toBeInTheDocument();
  });

  it('toggles item completion state on click', () => {
    render(<ShoppingListWidget />);
    const itemButton = screen.getByRole('button', { name: /Toggle Milk/i });
    const itemText = within(itemButton).getByText('Milk');
    
    // Initially not completed
    expect(itemText).not.toHaveClass('line-through');

    // Click to toggle
    fireEvent.click(itemButton);
    expect(itemText).toHaveClass('line-through');
  });

  it('adds an item via quick add', () => {
    render(<ShoppingListWidget />);
    
    // Check Eggs isn't in the active list initially
    expect(screen.queryByRole('button', { name: /Toggle Eggs/i })).not.toBeInTheDocument();

    // Click "Eggs" in the Quick Add menu
    const eggButton = screen.getByRole('button', { name: /Quick add Eggs/i });
    fireEvent.click(eggButton);

    // Now it should be in the list
    expect(screen.getByRole('button', { name: /Toggle Eggs/i })).toBeInTheDocument();
  });

  it('prevents duplicate active items from quick add', () => {
    render(<ShoppingListWidget />);
    
    // Milk is already there. Clicking it in Quick Add shouldn't add another one.
    const milkQuickAdd = screen.getByRole('button', { name: /Quick add Milk/i });
    fireEvent.click(milkQuickAdd);

    const milkListItems = screen.getAllByRole('button', { name: /Toggle Milk/i });
    expect(milkListItems.length).toBe(1);
  });
});
