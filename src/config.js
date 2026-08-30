// Central place for environment-specific settings.
// Not used yet — booksService.js reads from mock data directly for now.
// When a real backend exists, booksService.js will read API_BASE_URL from
// here instead of hardcoding a URL, so switching between local dev,
// staging, and production is a one-line change.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
