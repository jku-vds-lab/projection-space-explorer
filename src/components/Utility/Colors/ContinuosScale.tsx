import { SchemeColor } from "./SchemeColor";
import { LinearColorScale } from "./LinearColorScale";
import { exception } from "console";
import { ContinuousMapping, DiscreteMapping } from "./Mapping";
var d3v5 = require('d3');



export class ScaleUtil {

  static mapScale(scale: LinearColorScale, value) {
    switch (scale.type) {
      case 'discrete':
        return scale.stops[value % scale.stops.length];
      case 'continuous':
        const interpolator = d3v5.scaleLinear()
        .domain(scale.stops.map((stop, index) => (1 / (scale.stops.length - 1)) * index)).range(scale.stops.map(stop => stop.hex));
        var d3color = d3v5.color(interpolator(value));
        return SchemeColor.rgbToHex(d3color.r, d3color.g, d3color.b);
    }
  }



  static mappingFromScale(scale: LinearColorScale, attribute, dataset) {
    if (scale.type === 'discrete') {
      // Generate scale
      return new DiscreteMapping(scale, [... new Set(dataset.vectors.map(vector => vector[attribute.key]))])
    }

    if (scale.type === 'continuous') {
      var min = null, max = null
      if (dataset.columns[attribute.key].range) {
        min = dataset.columns[attribute.key].range.min
        max = dataset.columns[attribute.key].range.max
      } else {
        var filtered = dataset.vectors.map(vector => vector[attribute.key])
        max = Math.max(...filtered)
        min = Math.min(...filtered)
      }

      return new ContinuousMapping(scale, { min: min, max: max })
    }

    return null
  }
}




export class ContinuosScale extends LinearColorScale {
  constructor(stops) {
    super(stops, "continuous");
  }
}

export class DiscreteScale extends LinearColorScale {
  constructor(stops) {
    super(stops, "discrete");
  }
}
