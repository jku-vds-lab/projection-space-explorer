import { ShallowSet } from "../ShallowSet";
import { Mapping } from "./Mapping";








export class DiscreteMapping extends Mapping {
  values: ShallowSet;

  constructor(scale, values) {
    super(scale);

    this.values = values;
  }

  index(value) {
    return this.values.indexOf(value);
  }

  map(value) {
    return this.scale.map(this.values.indexOf(value) % this.scale.stops.length);
  }
}
