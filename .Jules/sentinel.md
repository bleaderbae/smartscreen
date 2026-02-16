## 2025-02-12 - [Calendar URL Validation]
**Vulnerability:** Calendar service accepted arbitrary URLs, allowing potential SSRF (e.g., `file:///etc/passwd`) or XSS (e.g., `javascript:`).
**Learning:** `new URL()` validation combined with protocol checks (`http:`/`https:`) is essential when accepting user-provided URLs for fetching external resources.
**Prevention:** Always validate protocols for external resource fetching. Use strict allow-lists where possible, or at least deny-lists for dangerous protocols.

## 2025-02-12 - [Insecure Deserialization in LocalStorage]
**Vulnerability:** Direct `JSON.parse` on untrusted `localStorage` data caused application crashes (DoS) when data was malformed.
**Learning:** Even client-side storage can be corrupted or tampered with; never trust data from external sources, including `localStorage`.
**Prevention:** Wrap all `JSON.parse` calls in a safe utility that handles errors and returns a default fallback value.
