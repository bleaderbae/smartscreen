## 2026-02-12 - Interactive Card Pattern
**Learning:** The app uses `div` elements with `onClick` for widget cards (e.g., DailyFeedWidget), lacking keyboard accessibility and roles.
**Action:** When touching other widgets, check for this pattern and upgrade them to `role="button"` with `tabIndex={0}` and `onKeyDown` handlers, or wrap in a `<button>` if appropriate.
## 2026-02-12 - Touch-First Interaction
**Learning:** Wall-mounted touch screens lack hover states. Actions hidden behind hover (like the maximize icon) are undiscoverable.
**Action:** Ensure primary actions are always visible or have clear affordances. Use `active` states (e.g., `active:scale-95`) instead of hover states for tactile feedback.
## 2026-02-12 - Nested Interactive List Items
**Learning:** List items (`li`) acting as buttons (`role="button"`) create semantic conflicts when they contain other interactive elements like delete buttons. This confuses screen readers and limits touch targets.
**Action:** Remove `role="button"` from the `li` container. Instead, use a flex layout where the primary action (e.g., toggle) is wrapped in a dedicated interactive element (using `flex-1` for full width), and secondary actions sit alongside it. This ensures valid semantics and better touch targets.
## 2026-02-12 - Toggle State Accessibility
**Learning:** Interactive widgets that toggle state (like `ChoreWidget`) must verify `aria-pressed` to communicate the current state to screen readers, in addition to `role="button"`.
**Action:** Always pair `role="button"` with `aria-pressed={boolean}` for toggleable elements, and ensure `aria-label` describes the action and context, not just the label text.

## 2026-02-13 - Redundant Action Verbs in Toggle Buttons
**Learning:** When using `role="button"` with `aria-pressed`, adding verbs like \"Toggle\" to the label is redundant and verbose for screen readers (e.g., \"Toggle Milk, toggle button, pressed\").
**Action:** Use the noun (e.g., item name) as the label, letting the semantic role and state communicate the interaction type and status.

## 2026-02-20 - Morphing Action Button
**Learning:** Using a single button that rotates (e.g., `rotate-45`) to switch between \"Add\" and \"Cancel\" states reduces clutter and provides a delightful, fluid interaction.
**Action:** When adding expandable inline forms, reuse the trigger button as the close button with a transform transition instead of adding a separate close icon.

## 2026-02-21 - Actionable Empty States
**Learning:** Static "View All" buttons that do nothing frustrate users, while empty lists without guidance feel broken.
**Action:** Replace dead buttons with context-aware actions (e.g., "Clear Completed") and use illustrative empty states to guide users (e.g., "Your list is empty, add items above").

## 2026-02-22 - Preventative State Feedback
**Learning:** In "Quick Add" lists, users often don't know if an item is already added, leading to confusion or duplicate attempts.
**Action:** Visually disable and mark "active" items in selection lists (e.g., opacity-50, checkmark overlay) to prevent errors and provide immediate status feedback.

## 2026-02-24 - False Affordances in Cards
**Learning:** Widgets that use `role="button"` and pointer cursors but lack actual interactivity confuse users (especially screen reader users) who expect an action.
**Action:** Always implement a meaningful action (like expanding for details) for card-like widgets that appear interactive, or remove the interactive semantics if it's purely display.

## 2026-02-25 - Duplicate Entry Feedback and State Cleanup
**Learning:** Preventing duplicate list entries silently confuses users, while persisting error states after closing/reopening forms leads to a broken experience.
**Action:** Always provide immediate inline feedback for duplicates (e.g., "Item already in list") and ensure all temporary form states (text, errors) are reset when the form is toggled visibility.
