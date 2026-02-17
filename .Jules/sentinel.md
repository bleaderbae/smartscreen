## 2025-02-12 - [Calendar URL Validation]
**Vulnerability:** Calendar service accepted arbitrary URLs, allowing potential SSRF (e.g., `file:///etc/passwd`) or XSS (e.g., `javascript:`).
**Learning:** `new URL()` validation combined with protocol checks (`http:`/`https:`) is essential when accepting user-provided URLs for fetching external resources.
**Prevention:** Always validate protocols for external resource fetching. Use strict allow-lists where possible, or at least deny-lists for dangerous protocols.

## 2025-05-19 - [Calendar Fetch Limits]
**Vulnerability:** External calendar fetching lacked timeouts and size limits, exposing the client to DoS via hanging requests or large file downloads.
**Learning:** `axios` supports `timeout` and `maxContentLength` which are crucial for preventing resource exhaustion from malicious or misconfigured external servers.
**Prevention:** Always enforce strict `timeout` and `maxContentLength` limits when fetching external resources, especially user-provided URLs.
