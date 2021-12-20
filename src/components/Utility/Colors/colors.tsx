import { DiscreteMapping } from "./Mapping";
import { ContinuousMapping } from "./Mapping";
import { ShallowSet } from "../ShallowSet";
import { Dataset } from "../../../model/Dataset";
import { BaseColorScale } from "../../Ducks/ColorScalesDuck";

export const mappingFromScale = (scale: BaseColorScale, attribute, dataset: Dataset) => {
  if (scale.type === 'categorical') {
    // Generate scale
    return new DiscreteMapping(scale, new ShallowSet(dataset.vectors.map(vector => vector[attribute.key])))

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