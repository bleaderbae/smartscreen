## 2026-02-12 - Interactive Card Pattern
**Learning:** The app uses `div` elements with `onClick` for widget cards (e.g., DailyFeedWidget), lacking keyboard accessibility and roles.
**Action:** When touching other widgets, check for this pattern and upgrade them to `role="button"` with `tabIndex={0}` and `onKeyDown` handlers, or wrap in a `<button>` if appropriate.
## 2026-02-12 - Touch-First Interaction
**Learning:** Wall-mounted touch screens lack hover states. Actions hidden behind hover (like the maximize icon) are undiscoverable.
**Action:** Ensure primary actions are always visible or have clear affordances. Use `active` states (e.g., `active:scale-95`) instead of hover states for tactile feedback.
