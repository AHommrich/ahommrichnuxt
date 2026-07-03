import { describe, it, expect } from "vitest";
import { getCurrentAge } from "~/utils/age";

// Birthday: 1997-03-25. Age is computed relative to a reference date so the
// tests stay deterministic instead of drifting with real time.
describe("getCurrentAge", () => {
  it("returns exact age on the birthday itself", () => {
    expect(getCurrentAge(new Date(2020, 2, 25))).toBe(23);
  });

  it("subtracts one when the reference date is one day before the birthday", () => {
    expect(getCurrentAge(new Date(2020, 2, 24))).toBe(22);
  });

  it("returns the new age one day after the birthday", () => {
    expect(getCurrentAge(new Date(2020, 2, 26))).toBe(23);
  });

  it("uses the calendar year even when the birthday month hasn't arrived yet", () => {
    // February 2020 → still 22 (turns 23 in March)
    expect(getCurrentAge(new Date(2020, 1, 28))).toBe(22);
  });

  it("returns the incremented age when the birthday month has passed", () => {
    // April 2020 → already 23
    expect(getCurrentAge(new Date(2020, 3, 1))).toBe(23);
  });

  it("handles year boundaries — Dec 31 of year N and Jan 1 of year N+1 differ by 0 age units", () => {
    // Dec 31 2020 → still 23 (post-birthday same year)
    // Jan 1 2021 → still 23 (pre-birthday next year)
    expect(getCurrentAge(new Date(2020, 11, 31))).toBe(23);
    expect(getCurrentAge(new Date(2021, 0, 1))).toBe(23);
  });

  it("computes zero on the exact birth date", () => {
    expect(getCurrentAge(new Date(1997, 2, 25))).toBe(0);
  });

  it("defaults to the current time when no reference date is passed", () => {
    // Sanity check that the default path returns a plausible age.
    // André was born 1997-03-25 — anyone running this test is at least 25.
    const age = getCurrentAge();
    expect(age).toBeGreaterThanOrEqual(25);
    expect(age).toBeLessThan(120);
  });
});
