import { Mapping } from "./Mapping";








export class ContinuousMapping extends Mapping {
  range: any;

  constructor(scale, range) {
    super(scale);

    this.range = range;
  }

  map(value) {
    console.log(value);
    if (this.range.max == this.range.min) {
      return this.scale.map(0);
    }
    var normalized = (value - this.range.min) / (this.range.max - this.range.min);
    return this.scale.map(normalized);
  }
}
