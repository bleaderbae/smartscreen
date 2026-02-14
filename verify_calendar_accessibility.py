from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:5173/")

        # Wait for the app to load
        page.wait_for_selector("text=Next Event", timeout=10000)

        # Find the Calendar Widget
        # It should have the role button and the label we added
        # Since the mock data might change, we look for the static part of the label or just the role button within the widget area
        # The widget has "Next Event" text inside it.

        # Let's find the element that contains "Next Event" and is a button
        # proper accessible name should be "Next event: ..." or "Calendar: ..."

        # We can try to tab to it.
        page.keyboard.press("Tab")
        page.keyboard.press("Tab")
        # Depending on tab order, we might need more tabs.
        # But we can also just focus it directly if we find it.

        # Let's find it by role button and some text inside it to be sure
        # The aria-label is dynamic, so let's rely on the text "Next Event" being inside the button
        # But the button is the wrapper div.

        calendar_widget = page.locator("div[role='button']").filter(has_text="Next Event")

        # Check if it has the aria-label (partial match)
        # We expect "Next event:" or "Calendar: No upcoming events"
        aria_label = calendar_widget.get_attribute("aria-label")
        print(f"Calendar Widget Aria Label: {aria_label}")

        if not aria_label:
            print("Error: Calendar Widget missing aria-label")
            browser.close()
            return

        # Focus the widget
        calendar_widget.focus()

        # Check if it has focus visible ring (we added focus-visible:ring-2)
        # Taking a screenshot of the focused state would be good
        page.screenshot(path="verification_focused.png")
        print("Took screenshot of focused state: verification_focused.png")

        # Press Enter to expand
        page.keyboard.press("Enter")

        # Wait for the modal to appear
        # It has role="dialog" and aria-label="Family Agenda"
        modal = page.locator("div[role='dialog'][aria-label='Family Agenda']")
        expect(modal).to_be_visible()

        # Take a screenshot of the expanded modal
        page.screenshot(path="verification_expanded.png")
        print("Took screenshot of expanded modal: verification_expanded.png")

        # Press Escape to close
        page.keyboard.press("Escape")

        # Wait for modal to disappear
        expect(modal).not_to_be_visible()

        print("Verification successful!")

        browser.close()

if __name__ == "__main__":
    run()
