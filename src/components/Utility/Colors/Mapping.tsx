import { SchemeColor } from ".";
import { ShallowSet } from "../ShallowSet";
import { ScaleUtil } from "./ContinuosScale";
import { BaseColorScale, APalette } from "../../Ducks/ColorScalesDuck";

export abstract class Mapping {
  scale: BaseColorScale;

  constructor(scale) {
    this.scale = scale;
  }

  abstract map(value): any;
}


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
    const palette = typeof this.scale.palette === 'string' ? APalette.getByName(this.scale.palette) : this.scale.palette
    return ScaleUtil.mapScale(this.scale, this.values.indexOf(value) % palette.length);
  }
}

// ---usage example:
// let background_colorMapping = new ContinuousMapping(
//     {
//         palette: [new SchemeColor('#fefefe'), new SchemeColor('#111111')],
//         type: 'sequential'
//     },
//     range // needs to have the same range as the overview Dataset
// );
export class ContinuousMapping extends Mapping {
  range: any;

  constructor(scale, range) {
    super(scale);

    this.range = range;
  }

  map(value): SchemeColor {
    if (this.range.max == this.range.min) {
      const palette = typeof this.scale.palette === 'string' ? APalette.getByName(this.scale.palette) : this.scale.palette
      return palette[0];
    }
    
    var normalized = (value - this.range.min) / (this.range.max - this.range.min);

    return ScaleUtil.mapScale(this.scale, normalized);
  }
}
