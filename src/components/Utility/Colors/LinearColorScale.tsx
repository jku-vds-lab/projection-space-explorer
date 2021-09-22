import { QualitativeScaleMapping } from "./QualitativeScaleMapping";
import { SequentialScaleMapping } from "./SequentialScaleMapping";
var d3v5 = require('d3');








export class LinearColorScale {
  stops: any;
  type: 'continuous' | 'discrete';

  constructor(stops, type) {
    this.stops = stops;
    this.type = type;
  }
}
