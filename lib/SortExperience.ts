const yearsOf = (years: string) => (years.match(/\d{4}/g) ?? []).map(Number);


export function sortExperience<T extends { years: string; current: boolean }>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const ya = yearsOf(a.years);
    const yb = yearsOf(b.years);
    const startA = ya.length ? Math.min(...ya) : 0;
    const startB = yb.length ? Math.min(...yb) : 0;
    if (startB !== startA) return startB - startA;

    if (a.current !== b.current) return a.current ? -1 : 1;

    const endA = ya.length ? Math.max(...ya) : 0;
    const endB = yb.length ? Math.max(...yb) : 0;
    return endB - endA;
  });
}