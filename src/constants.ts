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

/**
 * Specify whether the file paths that should to search are inside development
 * folder or not.
 *
 * This is necessary to use bot handlers.
 */
export const PATH_CREATOR_DEV_MODE: boolean = false as const;
