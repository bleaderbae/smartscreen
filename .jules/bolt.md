## 2026-02-16 - [Early Filtering in Data Pipelines]
**Learning:** Processing entire datasets (like iCal feeds) by creating objects for all items before filtering is inefficient for memory and CPU.
**Action:** Use `reduce` to filter and transform in a single pass, avoiding object creation for irrelevant items.

## 2026-02-18 - [Testing React.memo]
**Learning:** To verify `React.memo` optimization, the mocked component itself must be wrapped in `React.memo` inside `vi.mock`, otherwise the test runner will re-render the mock function regardless of prop stability.
**Action:** When testing memoization, use `vi.hoisted` to create the spy, and `React.memo` inside `vi.mock` to wrap the spy component.
