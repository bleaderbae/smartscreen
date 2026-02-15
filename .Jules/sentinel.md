## 2026-02-15 - Calendar Input Validation
**Vulnerability:** The `fetchCalendarEvents` service accepted arbitrary URLs from configuration without validation, potentially allowing SSRF or access to local resources (`file://`, `javascript:`) if the environment supports it.
**Learning:** Even in client-side applications, validating input URLs is crucial. Existing tests relied on invalid dummy URLs (`'url1'`), masking the lack of validation and requiring test refactoring when validation was introduced.
**Prevention:** Always validate URL protocols (`http:`, `https:`) before making requests. Use valid dummy URLs in tests to ensure they don't break when proper validation logic is added.
