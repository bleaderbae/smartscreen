## 2026-02-16 - [Early Filtering in Data Pipelines]
**Learning:** Processing entire datasets (like iCal feeds) by creating objects for all items before filtering is inefficient for memory and CPU.
**Action:** Use `reduce` to filter and transform in a single pass, avoiding object creation for irrelevant items.

## 2026-02-16 - [Loop-Invariant Code Motion]
**Learning:** Performing invariant calculations (like `differenceInCalendarWeeks` for a fixed date) inside a filter loop recalculates the same value needlessly for every item.
**Action:** Hoist constant calculations outside the loop to reduce CPU cycles, especially in frequent operations like list filtering.

## 2026-02-16 - [Optimizing Render Loops with Pre-Calculated Keys]
**Learning:** Calling `date-fns` formatting functions (like `format`, `startOfWeek`) inside a render loop (e.g., `map`) for every item creates significant overhead (20x slowdown in benchmarks) when the date is constant.
**Action:** Pre-calculate date strings/keys once per render (or memoize them) and pass them into the loop or helper functions.

## 2026-02-16 - [Set Memoization for Render Loops]
**Learning:** Using `Array.some` or `Array.find` within `Array.map` during a render loop causes `O(N*M)` complexity, creating significant overhead, particularly in highly interactive widgets like inputs that re-render on every keystroke.
**Action:** Replace `Array.some/find` lookups by computing an `O(1)` `Set` using `useMemo`. This moves the lookup complexity from `O(N*M)` on every render to `O(N)` only when the source array changes.
