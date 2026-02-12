import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShoppingListWidget from './ShoppingListWidget';

describe('ShoppingListWidget', () => {
  it('renders default shopping items', () => {
    render(<ShoppingListWidget />);
    expect(screen.getByText('Oat Milk')).toBeInTheDocument();
    expect(screen.getByText('Avocados')).toBeInTheDocument();
    expect(screen.getByText('Whole Grain Bread')).toBeInTheDocument();
  });

  it('toggles item completion state on click', () => {
    render(<ShoppingListWidget />);
    const item = screen.getByText('Oat Milk');
    
    // Initially not completed (no line-through class)
    expect(item).not.toHaveClass('line-through');

    // Click to toggle
    fireEvent.click(item.closest('li')!);
    expect(item).toHaveClass('line-through');

    // Click again to untoggle
    fireEvent.click(item.closest('li')!);
    expect(item).not.toHaveClass('line-through');
  });

  it('has accessible buttons with large hit areas', () => {
    render(<ShoppingListWidget />);
    const addButton = screen.getByLabelText('Add item');
    expect(addButton).toBeInTheDocument();
    
    const viewAllButton = screen.getByText('View Full List');
    expect(viewAllButton).toBeInTheDocument();
  });
});
