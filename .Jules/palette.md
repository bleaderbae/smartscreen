## 2026-02-12 - Interactive Card Pattern
**Learning:** The app uses `div` elements with `onClick` for widget cards (e.g., DailyFeedWidget), lacking keyboard accessibility and roles.
**Action:** When touching other widgets, check for this pattern and upgrade them to `role="button"` with `tabIndex={0}` and `onKeyDown` handlers, or wrap in a `<button>` if appropriate.
## 2026-02-12 - Touch-First Interaction
**Learning:** Wall-mounted touch screens lack hover states. Actions hidden behind hover (like the maximize icon) are undiscoverable.
**Action:** Ensure primary actions are always visible or have clear affordances. Use `active` states (e.g., `active:scale-95`) instead of hover states for tactile feedback.
## 2026-02-12 - Nested Interactive List Items
**Learning:** List items (`li`) acting as buttons (`role="button"`) create semantic conflicts when they contain other interactive elements like delete buttons. This confuses screen readers and limits touch targets.
**Action:** Remove `role="button"` from the `li` container. Instead, use a flex layout where the primary action (e.g., toggle) is wrapped in a dedicated interactive element (using `flex-1` for full width), and secondary actions sit alongside it. This ensures valid semantics and better touch targets.
