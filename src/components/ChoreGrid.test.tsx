import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChoreGrid from './ChoreGrid';

describe('ChoreGrid', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders default chores', () => {
    render(<ChoreGrid />);
    // Check for some default chores
    expect(screen.getByText('Feed Dogs')).toBeInTheDocument();
    expect(screen.getByText('Family Chores')).toBeInTheDocument();
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('chore-completions', 'INVALID_JSON{');

    render(<ChoreGrid />);
    // If it renders, check for default items
    expect(screen.getByText('Feed Dogs')).toBeInTheDocument();
  });
});
