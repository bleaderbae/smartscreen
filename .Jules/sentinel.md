## 2025-02-12 - [Calendar URL Validation]
**Vulnerability:** Calendar service accepted arbitrary URLs, allowing potential SSRF (e.g., `file:///etc/passwd`) or XSS (e.g., `javascript:`).
**Learning:** `new URL()` validation combined with protocol checks (`http:`/`https:`) is essential when accepting user-provided URLs for fetching external resources.
**Prevention:** Always validate protocols for external resource fetching. Use strict allow-lists where possible, or at least deny-lists for dangerous protocols.

## 2025-02-12 - [DoS Protection for External Fetches]
**Vulnerability:** External calendar fetching lacked timeouts and size limits, exposing the application to Denial of Service (DoS) via hanging requests or large file downloads (OOM).
**Learning:** Client-side fetchers (like `axios` or `fetch`) need explicit timeouts and size checks, especially when dealing with user-configurable URLs. `axios` in browser environment requires `timeout` and manual progress checks (or `maxBodyLength` for consistency/adapters) to prevent resource exhaustion.
**Prevention:** Always configure `timeout` and implement response size limits (via `Content-Length` checks or stream monitoring) for all external resource requests.
