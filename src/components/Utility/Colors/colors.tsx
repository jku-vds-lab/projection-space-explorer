/* eslint-disable prefer-destructuring */
import { DiscreteMapping, ContinuousMapping } from './Mapping';
import { ShallowSet } from '../ShallowSet';
import { Dataset } from '../../../model/Dataset';
import { BaseColorScale } from '../../../model/Palette';

export const mappingFromScale = (scale: BaseColorScale, attribute, dataset: Dataset) => {
  if (scale.type === 'categorical') {
    // Generate scale
    return new DiscreteMapping(scale, new ShallowSet(dataset.vectors.map((vector) => vector[attribute.key])));
  }
  if (scale.type === 'sequential') {
    let min = null;
    let max = null;
    if (dataset.columns[attribute.key].range) {
      min = dataset.columns[attribute.key].range.min;
      max = dataset.columns[attribute.key].range.max;
    } else {
      const filtered = dataset.vectors.map((vector) => vector[attribute.key]);
      max = Math.max(...filtered);
      min = Math.min(...filtered);
    }

    return new ContinuousMapping(scale, { min, max });
  }
  return null;
};
