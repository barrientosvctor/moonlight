/*
 * Maximum number for rate limit per user (slowmode)
 * Measure unit: seconds
 */
export const SLOWMODE_LIMIT = 21600 as const;

/**
 * Maximum number for timeout duration (1 week, 1 second).
 * Measure unit: milliseconds.
 */
export const TIMEOUT_LIMIT = 604_801_000 as const;
