## 2026-02-16 - [Early Filtering in Data Pipelines]
**Learning:** Processing entire datasets (like iCal feeds) by creating objects for all items before filtering is inefficient for memory and CPU.
**Action:** Use `reduce` to filter and transform in a single pass, avoiding object creation for irrelevant items.

## 2025-02-18 - [React.memo Verification in Tests]
**Learning:** Standard component mocks created with `vi.fn()` bypass `React.memo` optimizations, causing tests to report false negatives for re-render checks.
**Action:** Explicitly wrap mock components in `React.memo` within the `vi.mock` factory when verifying memoization behavior.
