import { SchemeColor } from "./SchemeColor";
import { LinearColorScale } from "./LinearColorScale";
var d3v5 = require('d3');








export class ContinuosScale extends LinearColorScale {
  constructor(stops) {
    super(stops, "continuous");
  }

  map(value) {
    var d3color = d3v5.color(this.interpolator(value));
    return SchemeColor.rgbToHex(d3color.r, d3color.g, d3color.b);
  }
}

export class DiscreteScale extends LinearColorScale {
  constructor(stops) {
    super(stops, "discrete");
  }

  map(value) {
    return this.stops[value % this.stops.length];
  }
}
