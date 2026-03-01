from playwright.sync_api import sync_playwright

def verify_shopping_list():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:5173")

            # Click add item button
            add_button = page.get_by_role("button", name="Add item")
            add_button.click()

            # Find the input and take a screenshot to verify it's there
            input_field = page.get_by_role("textbox", name="New item name")
            # Fill with a long string to see if it gets truncated (we can't easily see maxLength, but we can try to type a lot and see it truncated)
            long_string = "A" * 60
            input_field.fill(long_string)

            # We expect the length to be 50 because of maxLength
            # We can assert this in python
            value = input_field.input_value()
            assert len(value) == 50, f"Expected length 50, but got {len(value)}"

            page.screenshot(path="verification_shopping_list_input.png")

            # Now add 100 items... wait, that's too slow.
            # Instead, we will simulate a full list by injecting 100 items into localStorage
            page.evaluate("""
                const items = Array.from({ length: 100 }).map((_, i) => ({
                    id: String(i), text: `Item ${i}`, completed: false
                }));
                localStorage.setItem('shopping-list', JSON.stringify(items));
            """)
            page.reload()

            # Add button should be disabled now and have label 'List full'
            disabled_button = page.get_by_role("button", name="List full", exact=True)
            disabled_button.wait_for(state="visible")

            page.screenshot(path="verification_shopping_list_full.png")

        finally:
            browser.close()

if __name__ == "__main__":
    verify_shopping_list()