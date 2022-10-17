/* eslint-disable prefer-destructuring */
import { DiscreteMapping, ContinuousMapping, DivergingMapping } from './Mapping';
import { ShallowSet } from '../ShallowSet';
import { Dataset } from '../../../model/Dataset';
import { BaseColorScale } from '../../../model/Palette';
import { getMinMaxOfChannel } from '../../WebGLView/UtilityFunctions';

export const mappingFromScale = (scale: BaseColorScale, attribute, dataset: Dataset) => {
  if (scale.type === 'categorical') {
    // Generate scale
    return new DiscreteMapping(scale, new ShallowSet(dataset.vectors.map((vector) => vector[attribute.key])));
  }
  if (scale.type === 'sequential') {
    const { min, max } = getMinMaxOfChannel(dataset, attribute.key)

    return new ContinuousMapping(scale, { min, max });
  }
  if (scale.type === 'diverging') {
    const { min, max } = getMinMaxOfChannel(dataset, attribute.key)

    return new DivergingMapping(scale, [min, (min + max) / 2, max]);
  }
  return null;
};
