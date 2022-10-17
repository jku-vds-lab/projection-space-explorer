import * as d3v5 from 'd3v5';
import { SchemeColor } from './SchemeColor';
import { ShallowSet } from '../ShallowSet';
import { BaseColorScale } from '../../../model/Palette';
import { APalette } from '../../../model/palettes';

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
    const palette = typeof this.scale.palette === 'string' ? APalette.getByName(this.scale.palette) : this.scale.palette;
    return palette[this.values.indexOf(value) % palette.length];
  }
}

export class ContinuousMapping extends Mapping {
  range: any;

  constructor(scale, range) {
    super(scale);

    this.range = range;
  }

  map(value): SchemeColor {
    const palette = typeof this.scale.palette === 'string' ? APalette.getByName(this.scale.palette) : this.scale.palette;

    if (this.range.max === this.range.min) {
      return palette[0];
    }

    const normalized = (value - this.range.min) / (this.range.max - this.range.min);

    const interpolator = d3v5
      .scaleLinear()
      .domain(palette.map((stop, index) => (1 / (palette.length - 1)) * index))
      // @ts-ignore
      .range(palette.map((stop) => stop.hex));
    // @ts-ignore
    const d3color = d3v5.color(interpolator(normalized));
    // @ts-ignore
    return SchemeColor.rgbToHex(d3color.r, d3color.g, d3color.b);
  }
}

export class DivergingMapping extends Mapping {
  range: [number, number, number];

  constructor(scale, range: [number, number, number]) {
    super(scale);

    this.range = range;
  }

  map(value): SchemeColor {
    const palette = typeof this.scale.palette === 'string' ? APalette.getByName(this.scale.palette) : this.scale.palette;

    if (this.range[0] === this.range[1]) {
      return palette[1];
    }

    const interpolator = d3v5
      .scaleDiverging(d3v5.interpolateBrBG)
      .domain(this.range)

    const d3color = d3v5.color(interpolator(value));
    // @ts-ignore
    return SchemeColor.rgbToHex(d3color.r, d3color.g, d3color.b);
  }
}



