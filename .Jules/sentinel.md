## 2025-02-12 - [Calendar URL Validation]
**Vulnerability:** Calendar service accepted arbitrary URLs, allowing potential SSRF (e.g., `file:///etc/passwd`) or XSS (e.g., `javascript:`).
**Learning:** `new URL()` validation combined with protocol checks (`http:`/`https:`) is essential when accepting user-provided URLs for fetching external resources.
**Prevention:** Always validate protocols for external resource fetching. Use strict allow-lists where possible, or at least deny-lists for dangerous protocols.

## 2025-02-18 - [Unbounded Resource Consumption in Calendar Service]
**Vulnerability:** The `fetchCalendarEvents` function in `calendarService.ts` fetched external ICS files without any size limits or timeouts.
**Learning:** Even when using higher-level libraries like `axios`, defaults often prioritize functionality over security (no default timeout or size limit). This exposes the application to Denial of Service (DoS) attacks where a malicious actor provides a massive file or a non-responsive server to exhaust resources.
**Prevention:** Always configure explicit `timeout` and `maxContentLength` (or `size` limits) when making HTTP requests to user-controlled or external URLs.
