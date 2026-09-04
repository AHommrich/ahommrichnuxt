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

/** Full physics state — position + velocity — for one animated icon. */
export interface IconState extends VelocityState {
  x: number;
  y: number;
}

/**
 * Applies a proximity-based flee force to the icon's velocity.
 * The force is strongest at distance 0 (equal to `force`) and fades linearly
 * to zero at `radius`. Outside `radius` or exactly at the pointer (distSq === 0)
 * nothing happens — the latter avoids a division-by-zero at coincident points.
 */
export const applyFleeForce = (
  state: IconState,
  pointerX: number,
  pointerY: number,
  radius: number,
  force: number,
): void => {
  const dx = state.x - pointerX;
  const dy = state.y - pointerY;
  const distSq = dx * dx + dy * dy;
  if (distSq >= radius * radius || distSq === 0) return;
  const dist = Math.sqrt(distSq);
  const magnitude = (1 - dist / radius) * force;
  state.vx += (dx / dist) * magnitude;
  state.vy += (dy / dist) * magnitude;
};

/** Multiplies both velocity components by `damping` (a per-frame friction factor). */
export const applyDamping = (state: VelocityState, damping: number): void => {
  state.vx *= damping;
  state.vy *= damping;
};

/**
 * Clamps the icon inside the container and reflects the velocity component
 * that crossed a wall. `halfSize` is the icon radius (position is center-based).
 * Bouncing uses `Math.abs` rather than `-vx` so an already-outward-moving icon
 * that gets clamped on a corner doesn't immediately bounce back into the wall.
 */
export const bounceOffBounds = (
  state: IconState,
  halfSize: number,
  containerW: number,
  containerH: number,
): void => {
  if (state.x < halfSize) {
    state.x = halfSize;
    state.vx = Math.abs(state.vx);
  } else if (state.x > containerW - halfSize) {
    state.x = containerW - halfSize;
    state.vx = -Math.abs(state.vx);
  }
  if (state.y < halfSize) {
    state.y = halfSize;
    state.vy = Math.abs(state.vy);
  } else if (state.y > containerH - halfSize) {
    state.y = containerH - halfSize;
    state.vy = -Math.abs(state.vy);
  }
};

/**
 * Returns the top-left translate offsets for the icon at `index` in the info-mode
 * grid. Layout is row-major: index 0 → top-left, columns fill first.
 * `barH` reserves vertical space at the top of the container for the toggle bar.
 */
export const computeInfoGridPosition = (
  index: number,
  cols: number,
  cardW: number,
  cardH: number,
  cardGap: number,
  cardPad: number,
  barH: number,
): { tx: number; ty: number } => {
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {
    tx: cardPad + col * (cardW + cardGap),
    ty: barH + cardPad + row * (cardH + cardGap),
  };
};
