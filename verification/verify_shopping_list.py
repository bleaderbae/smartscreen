import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Go to the app
        print("Navigating to app...")
        try:
            page.goto("http://localhost:5173", timeout=10000)
        except Exception as e:
            print(f"Error navigating: {e}")
            # Try again with longer timeout
            page.goto("http://localhost:5173", timeout=30000)

        # Wait for the widget to load
        print("Waiting for Shopping List...")
        page.wait_for_selector("text=Shopping List")

        # Take initial screenshot
        page.screenshot(path="verification/1_initial.png")

        # Find the Add button
        # It's the button with aria-label "Add item"
        add_btn = page.locator("button[aria-label='Add item']")
        if not add_btn.is_visible():
            print("Add button not found!")
            return

        print("Clicking Add button...")
        add_btn.click()

        # Wait for input
        page.wait_for_selector("input[placeholder='What do you need?']")

        # Screenshot with form open
        print("Taking screenshot with form open...")
        page.screenshot(path="verification/2_form_open.png")

        # Type item
        print("Typing item...")
        page.fill("input[placeholder='What do you need?']", "Test Item 123")

        # Submit
        print("Submitting...")
        page.click("button[aria-label='Confirm add item']")

        # Wait for item to appear
        print("Waiting for item...")
        page.wait_for_selector("text=Test Item 123")

        # Screenshot with item added
        print("Taking final screenshot...")
        page.screenshot(path="verification/3_item_added.png")

        browser.close()

if __name__ == "__main__":
    run()
