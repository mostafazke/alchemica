/** Usage counts that drive ElementCard visual energy states */
export const FREQUENCY_THRESHOLDS = {
  /** Below this count (inclusive): "fresh" state (amber glow, recently discovered) */
  FRESH_MAX: 5,
  /** Above this count (inclusive): "settled" state (reduced opacity, old friend) */
  SETTLED_MIN: 20,
} as const;

/** Session-scoped: elements discovered in current session get fresh glow regardless of count */
export const SESSION_FRESH_DURATION_MS = Infinity; // lasts until app close
