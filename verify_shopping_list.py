from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    print("Navigating to http://localhost:5173")
    page.goto("http://localhost:5173")

    # Wait for Shopping List widget
    print("Waiting for Shopping List...")
    page.wait_for_selector("text=Shopping List")

    # Click Add Item button (the plus icon)
    print("Clicking Add Item button...")
    # The button has aria-label="Add item"
    page.get_by_role("button", name="Add item").click()

    # Type 'Milk'
    print("Typing 'Milk'...")
    page.get_by_label("New item name").fill("Milk")

    # Wait a bit for UI to update
    page.wait_for_timeout(1000)

    # Take screenshot
    print("Taking screenshot...")
    page.screenshot(path="verification_shopping_list.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
