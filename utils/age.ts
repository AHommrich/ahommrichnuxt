/**
 * Returns André's age in years relative to `referenceDate` (defaults to now).
 * The reference date is injectable so tests can pin a specific day without
 * mocking the global Date object.
 *
 * Birthday: 1997-03-25. Month is 0-indexed (Date API), so 2 = March.
 */
export function getCurrentAge(referenceDate: Date = new Date()): number {
  const birthday = new Date(1997, 2, 25);
  let age = referenceDate.getFullYear() - birthday.getFullYear();
  const monthDelta = referenceDate.getMonth() - birthday.getMonth();
  // Not yet reached this year's birthday — subtract one year
  if (
    monthDelta < 0 ||
    (monthDelta === 0 && referenceDate.getDate() < birthday.getDate())
  ) {
    age--;
  }
  return age;
}
