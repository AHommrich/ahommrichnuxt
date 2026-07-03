import { describe, it, expect, vi, afterEach } from "vitest";
import {
  applyDamping,
  applyFleeForce,
  bounceOffBounds,
  computeGridDimensions,
  computeInfoGridPosition,
  ensureMinSpeed,
  lerp,
} from "~/utils/animation";

describe("lerp", () => {
  it("returns start when t=0", () => {
    expect(lerp(10, 20, 0)).toBe(10);
  });

  it("returns end when t=1", () => {
    expect(lerp(10, 20, 1)).toBe(20);
  });

  it("interpolates linearly at the midpoint", () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
  });

  it("extrapolates beyond the range when t is outside [0,1]", () => {
    expect(lerp(0, 10, 1.5)).toBe(15);
    expect(lerp(0, 10, -0.5)).toBe(-5);
  });
});

describe("computeGridDimensions", () => {
  it("keeps a minimum of 2 columns even on very narrow containers", () => {
    const { cols } = computeGridDimensions(100);
    expect(cols).toBe(2);
  });

  it("adds columns as the container widens past the minimum card width", () => {
    // Defaults: minCardW=160, cardGap=8, cardPad=4.
    // A 700px container fits 4 columns of 160 with the gap allowance.
    const { cols } = computeGridDimensions(700);
    expect(cols).toBe(4);
  });

  it("shrinks each cardW so cols cards + gaps exactly fill the padded container", () => {
    const containerW = 700;
    const cardGap = 8;
    const cardPad = 4;
    const { cols, cardW } = computeGridDimensions(
      containerW,
      160,
      cardGap,
      cardPad,
    );

    const totalGaps = (cols - 1) * cardGap;
    const totalCardWidth = cols * cardW;
    const inner = containerW - cardPad * 2;
    // cardW is floored, so used-space can be up to `cols` pixels short of the inner width.
    expect(totalCardWidth + totalGaps).toBeLessThanOrEqual(inner);
    expect(totalCardWidth + totalGaps).toBeGreaterThanOrEqual(inner - cols);
  });

  it("honours custom minCardW / cardGap / cardPad", () => {
    // Wide container with an aggressive minimum card width — should stay at 2 cols
    const { cols, cardW } = computeGridDimensions(400, 200, 10, 5);
    expect(cols).toBe(2);
    // (400 - 10) - 10 = 380; /2 = 190
    expect(cardW).toBe(190);
  });
});

describe("ensureMinSpeed", () => {
  it("leaves a fast-enough vector untouched", () => {
    const state = { vx: 3, vy: 4 }; // speed = 5
    ensureMinSpeed(state, 1);
    expect(state.vx).toBe(3);
    expect(state.vy).toBe(4);
  });

  it("scales a slow vector up to exactly minSpeed", () => {
    const state = { vx: 0.3, vy: 0.4 }; // speed = 0.5
    ensureMinSpeed(state, 1);
    const newSpeed = Math.hypot(state.vx, state.vy);
    expect(newSpeed).toBeCloseTo(1, 10);
    // Direction preserved (ratio unchanged)
    expect(state.vx / state.vy).toBeCloseTo(0.3 / 0.4, 10);
  });

  it("assigns a random direction with the target speed when the vector is exactly (0,0)", () => {
    // Force a deterministic angle via Math.random stub
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);
    const state = { vx: 0, vy: 0 };
    ensureMinSpeed(state, 2);
    // angle = 0 → vx = cos(0)*2 = 2, vy = sin(0)*2 = 0
    expect(state.vx).toBe(2);
    expect(state.vy).toBe(0);
    randomSpy.mockRestore();
  });
});

describe("applyFleeForce", () => {
  const RADIUS = 100;
  const FORCE = 5;

  it("does nothing when the pointer is exactly at the radius (boundary is exclusive)", () => {
    // Icon at (100, 0), pointer at (0, 0) → distance == RADIUS
    const state = { x: 100, y: 0, vx: 0, vy: 0 };
    applyFleeForce(state, 0, 0, RADIUS, FORCE);
    expect(state.vx).toBe(0);
    expect(state.vy).toBe(0);
  });

  it("does nothing when the pointer is farther than the radius", () => {
    const state = { x: 200, y: 0, vx: 0, vy: 0 };
    applyFleeForce(state, 0, 0, RADIUS, FORCE);
    expect(state.vx).toBe(0);
    expect(state.vy).toBe(0);
  });

  it("does nothing when icon and pointer are coincident (avoids division by zero)", () => {
    const state = { x: 42, y: 42, vx: 1, vy: 1 };
    applyFleeForce(state, 42, 42, RADIUS, FORCE);
    // Velocity untouched — no force applied
    expect(state.vx).toBe(1);
    expect(state.vy).toBe(1);
  });

  it("pushes the icon directly away from the pointer along the pointer→icon axis", () => {
    // Icon at (50, 0) relative to pointer at (0, 0), radius 100, force 5.
    // Distance = 50 → factor (1 - 50/100) * 5 = 2.5
    // Direction unit vector: (1, 0) → vx += 2.5, vy += 0
    const state = { x: 50, y: 0, vx: 0, vy: 0 };
    applyFleeForce(state, 0, 0, RADIUS, FORCE);
    expect(state.vx).toBeCloseTo(2.5, 10);
    expect(state.vy).toBeCloseTo(0, 10);
  });

  it("scales the force linearly with proximity — closer = stronger", () => {
    // Icon just barely inside the radius (99px away): tiny push
    const far = { x: 99, y: 0, vx: 0, vy: 0 };
    applyFleeForce(far, 0, 0, RADIUS, FORCE);
    // Icon right next to pointer (1px away): near-maximum push
    const near = { x: 1, y: 0, vx: 0, vy: 0 };
    applyFleeForce(near, 0, 0, RADIUS, FORCE);
    expect(near.vx).toBeGreaterThan(far.vx);
    expect(near.vx).toBeGreaterThan(FORCE * 0.9); // very close to max
    expect(far.vx).toBeLessThan(FORCE * 0.1); // very close to zero
  });

  it("adds to (does not overwrite) existing velocity", () => {
    const state = { x: 50, y: 0, vx: 10, vy: -3 };
    applyFleeForce(state, 0, 0, RADIUS, FORCE);
    // Existing vy untouched (no y component in direction)
    expect(state.vy).toBe(-3);
    // Existing vx augmented, not replaced
    expect(state.vx).toBeGreaterThan(10);
  });
});

describe("applyDamping", () => {
  it("multiplies both velocity components by the damping factor", () => {
    const state = { vx: 10, vy: -4 };
    applyDamping(state, 0.5);
    expect(state.vx).toBe(5);
    expect(state.vy).toBe(-2);
  });

  it("converges towards zero when applied repeatedly with a factor < 1", () => {
    const state = { vx: 100, vy: 100 };
    for (let i = 0; i < 100; i++) applyDamping(state, 0.9);
    expect(Math.abs(state.vx)).toBeLessThan(0.1);
    expect(Math.abs(state.vy)).toBeLessThan(0.1);
  });

  it("leaves velocity unchanged when damping is 1", () => {
    const state = { vx: 3, vy: 7 };
    applyDamping(state, 1);
    expect(state.vx).toBe(3);
    expect(state.vy).toBe(7);
  });
});

describe("bounceOffBounds", () => {
  const HALF = 10;
  const W = 200;
  const H = 100;

  it("does not touch position or velocity when fully inside bounds", () => {
    const state = { x: 100, y: 50, vx: 3, vy: -3 };
    bounceOffBounds(state, HALF, W, H);
    expect(state).toEqual({ x: 100, y: 50, vx: 3, vy: -3 });
  });

  it("clamps to the left wall and forces vx positive (rightward)", () => {
    const state = { x: 5, y: 50, vx: -8, vy: 0 };
    bounceOffBounds(state, HALF, W, H);
    expect(state.x).toBe(HALF);
    expect(state.vx).toBe(8);
  });

  it("clamps to the right wall and forces vx negative (leftward)", () => {
    const state = { x: W - 2, y: 50, vx: 6, vy: 0 };
    bounceOffBounds(state, HALF, W, H);
    expect(state.x).toBe(W - HALF);
    expect(state.vx).toBe(-6);
  });

  it("clamps to the top wall and forces vy positive (downward)", () => {
    const state = { x: 100, y: 3, vx: 0, vy: -4 };
    bounceOffBounds(state, HALF, W, H);
    expect(state.y).toBe(HALF);
    expect(state.vy).toBe(4);
  });

  it("clamps to the bottom wall and forces vy negative (upward)", () => {
    const state = { x: 100, y: H - 1, vx: 0, vy: 5 };
    bounceOffBounds(state, HALF, W, H);
    expect(state.y).toBe(H - HALF);
    expect(state.vy).toBe(-5);
  });

  it("uses abs()-based reflection so an outward-moving stuck icon doesn't re-enter", () => {
    // Icon past the right wall but already moving right — must reverse, not just negate
    const state = { x: W + 20, y: 50, vx: 4, vy: 0 };
    bounceOffBounds(state, HALF, W, H);
    expect(state.vx).toBe(-4);
    expect(state.x).toBe(W - HALF);
  });

  it("resolves corner overshoots on both axes in a single call", () => {
    const state = { x: -50, y: -50, vx: -3, vy: -7 };
    bounceOffBounds(state, HALF, W, H);
    expect(state.x).toBe(HALF);
    expect(state.y).toBe(HALF);
    expect(state.vx).toBe(3);
    expect(state.vy).toBe(7);
  });
});

describe("computeInfoGridPosition", () => {
  // Common layout: 4 cols, 100px cards, 8px gap, 4px pad, 52px bar
  const COLS = 4;
  const CARD_W = 100;
  const CARD_H = 40;
  const GAP = 8;
  const PAD = 4;
  const BAR_H = 52;

  it("places index 0 at (pad, bar + pad) — top-left corner below the bar", () => {
    const { tx, ty } = computeInfoGridPosition(
      0,
      COLS,
      CARD_W,
      CARD_H,
      GAP,
      PAD,
      BAR_H,
    );
    expect(tx).toBe(PAD);
    expect(ty).toBe(BAR_H + PAD);
  });

  it("increments column-first — index 1 is one card+gap to the right", () => {
    const { tx, ty } = computeInfoGridPosition(
      1,
      COLS,
      CARD_W,
      CARD_H,
      GAP,
      PAD,
      BAR_H,
    );
    expect(tx).toBe(PAD + CARD_W + GAP);
    expect(ty).toBe(BAR_H + PAD);
  });

  it("wraps to the next row after `cols` items", () => {
    const { tx, ty } = computeInfoGridPosition(
      COLS,
      COLS,
      CARD_W,
      CARD_H,
      GAP,
      PAD,
      BAR_H,
    );
    expect(tx).toBe(PAD);
    expect(ty).toBe(BAR_H + PAD + CARD_H + GAP);
  });

  it("places the 24th icon (index 23) into row 5 col 3 for a 4-col grid", () => {
    // 24 icons in 4 columns → 6 rows. Last index = 23 → row 5, col 3.
    const { tx, ty } = computeInfoGridPosition(
      23,
      COLS,
      CARD_W,
      CARD_H,
      GAP,
      PAD,
      BAR_H,
    );
    expect(tx).toBe(PAD + 3 * (CARD_W + GAP));
    expect(ty).toBe(BAR_H + PAD + 5 * (CARD_H + GAP));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
