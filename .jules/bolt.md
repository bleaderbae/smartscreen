## 2026-02-16 - [Early Filtering in Data Pipelines]
**Learning:** Processing entire datasets (like iCal feeds) by creating objects for all items before filtering is inefficient for memory and CPU.
**Action:** Use `reduce` to filter and transform in a single pass, avoiding object creation for irrelevant items.

## 2026-02-17 - [React List Optimization]
**Learning:** Rendering large lists (15+ items) where each item has event handlers created in the render cycle causes massive unnecessary re-renders. Moving handlers to `useCallback` and memoizing list items with `React.memo` is critical for interactive lists.
**Action:** Always wrap list item components in `React.memo` and ensure parent callbacks are stable with `useCallback`.
