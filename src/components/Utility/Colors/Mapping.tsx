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
    const palette = APalette.getByName(this.scale.palette)
    return ScaleUtil.mapScale(this.scale, this.values.indexOf(value) % palette.length);
  }
}


export class ContinuousMapping extends Mapping {
  range: any;

  constructor(scale, range) {
    super(scale);

    this.range = range;
  }

  map(value) {
    if (this.range.max == this.range.min) {
      const palette = APalette.getByName(this.scale.palette)
      return palette[0];
    }
    
    var normalized = (value - this.range.min) / (this.range.max - this.range.min);

    return ScaleUtil.mapScale(this.scale, normalized);
  }
}
