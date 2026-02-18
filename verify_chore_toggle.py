from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:5173/")

    # Wait for ChoreGrid to load
    page.wait_for_selector("text=Family Chores")

    # Take initial screenshot
    page.screenshot(path="before_toggle.png")

    # Find a chore. "Feed Dogs" is usually first.
    # The widget has role="button" and text "Feed Dogs".
    chore = page.get_by_role("button", name="Feed Dogs").first

    # Click it
    chore.click()

    # Wait for update (React state update is fast, but let's wait a bit or for attribute change)
    # The button should have aria-pressed="true"
    chore.wait_for(state="visible")
    # check if aria-pressed is true?
    # expect(chore).to_have_attribute("aria-pressed", "true") # but using raw python here for simplicity

    page.wait_for_timeout(500) # Wait for animation

    # Take screenshot after toggle
    page.screenshot(path="after_toggle.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
