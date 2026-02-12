## 2024-10-26 - NWS Grid Point Caching
**Learning:** The National Weather Service (NWS) API requires a two-step process: (1) fetch grid points for coordinates, (2) fetch forecast. The grid point URL is static for a given location but was being fetched on every update.
**Action:** Implemented in-memory caching for grid point URLs to halve the number of API calls for weather updates. Future integrations with NWS should respect this pattern.
