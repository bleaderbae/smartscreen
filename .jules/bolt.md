## 2026-02-16 - [Early Filtering in Data Pipelines]
**Learning:** Processing entire datasets (like iCal feeds) by creating objects for all items before filtering is inefficient for memory and CPU.
**Action:** Use `reduce` to filter and transform in a single pass, avoiding object creation for irrelevant items.

## 2026-02-16 - [Loop-Invariant Code Motion]
**Learning:** Performing invariant calculations (like `differenceInCalendarWeeks` for a fixed date) inside a filter loop recalculates the same value needlessly for every item.
**Action:** Hoist constant calculations outside the loop to reduce CPU cycles, especially in frequent operations like list filtering.
