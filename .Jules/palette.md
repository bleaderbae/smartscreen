## 2026-02-12 - Interactive Card Pattern
**Learning:** The app uses `div` elements with `onClick` for widget cards (e.g., DailyFeedWidget), lacking keyboard accessibility and roles.
**Action:** When touching other widgets, check for this pattern and upgrade them to `role="button"` with `tabIndex={0}` and `onKeyDown` handlers, or wrap in a `<button>` if appropriate.
