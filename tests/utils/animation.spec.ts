import { describe, it, expect, vi, afterEach } from "vitest";
import { lerp, computeGridDimensions, ensureMinSpeed } from "~/utils/animation";

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

afterEach(() => {
  vi.restoreAllMocks();
});
