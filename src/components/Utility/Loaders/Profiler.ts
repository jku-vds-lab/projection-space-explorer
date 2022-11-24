/**
 * Convenience class which helpts to provide timing statistics.
 */
export class Profiler {
  t0: number;

  count: number;

  constructor() {
    this.t0 = Date.now();
    this.count = 0;
  }

  profile(label: string) {
    this.count += 1;
    const t = Date.now();
    console.log(`${this.count} ${label}: ${(t - this.t0) / 1000}`);
    this.t0 = t;
  }
}
