## 2025-02-12 - [Calendar URL Validation]
**Vulnerability:** Calendar service accepted arbitrary URLs, allowing potential SSRF (e.g., `file:///etc/passwd`) or XSS (e.g., `javascript:`).
**Learning:** `new URL()` validation combined with protocol checks (`http:`/`https:`) is essential when accepting user-provided URLs for fetching external resources.
**Prevention:** Always validate protocols for external resource fetching. Use strict allow-lists where possible, or at least deny-lists for dangerous protocols.

## 2025-02-09 - [DoS Protection for External Fetches]
**Vulnerability:** External calendar fetches (ICS files) were vulnerable to Denial of Service (DoS) via hanging requests or large file sizes.
**Learning:** `axios` in the browser doesn't easily support `maxContentLength` for aborting downloads mid-stream without custom `onDownloadProgress` logic. However, checking `response.data.length` *before* passing to expensive parsers (like `ical.js`) is a critical defense against CPU exhaustion, even if the network bandwidth is used.
**Prevention:** Always add `timeout` to external fetches and validate response size before processing, especially for complex formats like ICS or XML.
