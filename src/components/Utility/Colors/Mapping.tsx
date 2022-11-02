import * as d3v5 from 'd3v5';
import { SchemeColor } from './SchemeColor';
import { AShallowSet } from '../ShallowSet';
import { BaseColorScale } from '../../../model/Palette';
import { APalette } from '../../../model/palettes';
import { getMinMaxOfChannel } from '../../WebGLView/UtilityFunctions';
import { Dataset } from '../../../model/Dataset';

// Color to use when the mapping is incomplete or impossible to map
const FALLBACK_COLOR = new SchemeColor('#000000');

export interface DiscreteMapping {
  scale: BaseColorScale;
  values: any[];
  type: 'categorical';
}

export interface ContinuousMapping {
  scale: BaseColorScale;
  type: 'sequential';
  range: [number, number];
}

export interface DivergingMapping {
  scale: BaseColorScale;
  range: [number, number, number];
  type: 'diverging';
}

/**
 * Helper function that maps a value to a color using a mapping
 *
 * @param mapping a mapping object
 * @param value any value
 * @returns a color
 */
export function mapValueToColor(mapping: ContinuousMapping | DivergingMapping | DiscreteMapping, value): SchemeColor {
  switch (mapping.type) {
    case 'sequential': {
      const [min, max] = mapping.range;

      const palette = typeof mapping.scale.palette === 'string' ? APalette.getByName(mapping.scale.palette) : mapping.scale.palette;

      if (min === max) {
        return palette[0];
      }

      const normalized = (value - min) / (max - min);

      const interpolator = d3v5
        .scaleLinear()
        .domain(palette.map((stop, index) => (1 / (palette.length - 1)) * index))
        // @ts-ignore
        .range(palette.map((stop) => stop.hex));
      // @ts-ignore
      const d3color = d3v5.color(interpolator(normalized));
      // @ts-ignore
      return d3color ? SchemeColor.rgbToHex(d3color.r, d3color.g, d3color.b) : FALLBACK_COLOR;
    }
    case 'diverging': {
      const palette = typeof mapping.scale.palette === 'string' ? APalette.getByName(mapping.scale.palette) : mapping.scale.palette;

      if (mapping.range[0] === mapping.range[1]) {
        return palette[1];
      }

      const paletteInterpolate = d3v5
        .scaleLinear()
        .domain(palette.map((stop, index) => (1 / (palette.length - 1)) * index))
        // @ts-ignore
        .range(palette.map((stop) => stop.hex));

      const interpolator = d3v5.scaleDiverging(paletteInterpolate).domain(mapping.range);

      // @ts-ignore
      const d3color = d3v5.color(interpolator(value)) as d3v5.RGBColor;

      return d3color ? SchemeColor.rgbToHex(d3color.r, d3color.g, d3color.b) : FALLBACK_COLOR;
    }
    case 'categorical': {
      const palette = typeof mapping.scale.palette === 'string' ? APalette.getByName(mapping.scale.palette) : mapping.scale.palette;
      return palette[AShallowSet.indexOf(mapping.values, value) % palette.length] ?? FALLBACK_COLOR;
    }
    default: {
      return FALLBACK_COLOR;
    }
  }
}

/**
 * Helper type that contains a union over all mappings
 */
export type Mapping = DiscreteMapping | DivergingMapping | ContinuousMapping;

/**
 *
 * @param scale the color scale
 * @param key the key for the data values
 * @param dataset the dataset
 * @returns a mapping object
 */
export const mappingFromScale = (scale: BaseColorScale, key: string, dataset: Dataset) => {
  if (scale.type === 'categorical') {
    return {
      scale,
      values: AShallowSet.create(dataset.vectors.map((vector) => vector[key])),
      type: 'categorical',
    } as DiscreteMapping;
  }
  if (scale.type === 'sequential') {
    const { min, max } = getMinMaxOfChannel(dataset, key);

    return {
      scale,
      type: 'sequential',
      range: [min, max],
    } as ContinuousMapping;
  }
  if (scale.type === 'diverging') {
    const { min, max } = getMinMaxOfChannel(dataset, key);

    return {
      scale,
      type: 'diverging',
      range: [min, (min + max) / 2, max],
    } as DivergingMapping;
  }
  return null;
};

/**
 *
 * @param mapping a mapping object
 * @returns true if the given value is a numeric one
 */
export function isNumericMapping(mapping: Mapping): mapping is DivergingMapping | ContinuousMapping {
  return mapping?.type === 'diverging' || mapping?.type === 'sequential';
}
