/**
 * Pure animation math helpers extracted from AppHeader.vue and AppTechSection.vue
 * so they can be unit-tested without mounting the components.
 * Behaviour must stay identical to the inlined originals.
 */

/** Linear interpolation between `a` and `b` at fraction `t` (0..1). */
export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

export interface GridDimensions {
  cols: number;
  cardW: number;
}

/**
 * Computes the number of columns and the resulting card width for the
 * info-mode grid in AppTechSection. At least 2 columns are used, even if the
 * container would only fit one at the requested minimum card width.
 */
export const computeGridDimensions = (
  containerW: number,
  minCardW = 160,
  cardGap = 8,
  cardPad = 4,
): GridDimensions => {
  const cols = Math.max(
    2,
    Math.floor((containerW - cardPad * 2 + cardGap) / (minCardW + cardGap)),
  );
  const cardW = Math.floor(
    (containerW - cardPad * 2 - (cols - 1) * cardGap) / cols,
  );
  return { cols, cardW };
};

export interface VelocityState {
  vx: number;
  vy: number;
}

/**
 * Ensures the given velocity vector never falls below `minSpeed`.
 * A completely stationary vector (0,0) is nudged into a random direction to
 * keep the physics loop lively.
 */
export const ensureMinSpeed = (
  state: VelocityState,
  minSpeed: number,
): void => {
  const speed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
  if (speed >= minSpeed) return;

  if (speed === 0) {
    const angle = Math.random() * Math.PI * 2;
    state.vx = Math.cos(angle) * minSpeed;
    state.vy = Math.sin(angle) * minSpeed;
    return;
  }

  const factor = minSpeed / speed;
  state.vx *= factor;
  state.vy *= factor;
};
