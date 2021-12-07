import { SchemeColor } from "./SchemeColor";
import { ContinuousMapping, DiscreteMapping } from "./Mapping";
import { BaseColorScale, APalette } from "../../Ducks/ColorScalesDuck";
var d3v5 = require('d3v5');



export class ScaleUtil {

  static mapScale(scale: BaseColorScale, value) {
    const palette = APalette.getByName(scale.palette)

    switch (scale.type) {
      case 'categorical':
        return palette[value % palette.length];
      case 'sequential':
        const interpolator = d3v5.scaleLinear()
          .domain(palette.map((stop, index) => (1 / (palette.length - 1)) * index)).range(palette.map(stop => stop.hex));
        var d3color = d3v5.color(interpolator(value));
        return SchemeColor.rgbToHex(d3color.r, d3color.g, d3color.b);
    }
  }



  static mappingFromScale(scale: BaseColorScale, attribute, dataset) {
    if (scale.type === 'categorical') {
      // Generate scale
      return new DiscreteMapping(scale, [... new Set(dataset.vectors.map(vector => vector[attribute.key]))])
    }

    if (scale.type === 'sequential') {
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