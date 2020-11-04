import { QualitativeScaleMapping } from "./QualitativeScaleMapping";
import { SequentialScaleMapping } from "./SequentialScaleMapping";
var d3v5 = require('d3');








export class LinearColorScale {
  stops: any;
  type: any;
  interpolator: any;

  constructor(stops, type) {
    this.stops = stops;
    this.type = type;
    this.interpolator = d3v5.scaleLinear()
      .domain(this.stops.map((stop, index) => (1 / (this.stops.length - 1)) * index)).range(this.stops.map(stop => stop.hex));

  }

  createMapping(range) {
    if (this.type == "continuous") {
      return new SequentialScaleMapping(this, range);
    } else {
      return new QualitativeScaleMapping(this, range);
    }
  }
}
