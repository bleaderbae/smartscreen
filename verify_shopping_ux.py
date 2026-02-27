from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # 1. Navigate to the app
    # Assuming Vite runs on port 5173 by default, but let's check.
    # If it fails, I'll need to check the port.
    try:
        page.goto("http://localhost:5173")
    except Exception as e:
        print(f"Failed to load page: {e}")
        return

    # 2. Wait for the Shopping List widget to appear
    # Based on the code, it has text "Shopping List"
    page.get_by_text("Shopping List").wait_for()

    # 3. Locate the Shopping List widget container
    # It's a bit hard to target strictly by container without a specific ID,
    # but we can find the "Add item" button.

    # 4. Click the "Add item" button (plus icon)
    add_button = page.get_by_role("button", name="Add item")
    add_button.click()

    # 5. Type "Milk" into the input (assuming "Milk" is a default item)
    input_field = page.get_by_role("textbox", name="New item name")
    input_field.fill("Milk")

    # 6. Click "Confirm add item" (or hit Enter)
    # The button is disabled until text is entered, so we wait a tick?
    # Playwright auto-waits for actionability.
    confirm_button = page.get_by_role("button", name="Confirm add item")
    confirm_button.click()

    # 7. Verify the error message appears
    error_message = page.get_by_text("Already on your list!")
    error_message.wait_for()

    # 8. Take a screenshot of the widget with the error
    # We can try to screenshot just the widget if we can find it,
    # or the whole page. Let's do the whole page for context,
    # and maybe a focused one.

    page.screenshot(path="verification_shopping_list.png")

    # 9. Clear the input to show error disappears (optional, but good verification)
    input_field.fill("Milk 2")
    # Wait for error to disappear - verify by checking hidden or detached
    # expect(error_message).to_be_hidden() # if I imported expect

    # Just screenshot the error state is enough for now.

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
