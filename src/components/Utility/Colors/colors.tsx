import { SchemeColor } from "./SchemeColor"
import { ContinuosScale, DiscreteScale } from "./ContinuosScale";
import { DiscreteMapping } from "./Mapping";
import { ContinuousMapping } from "./Mapping";
import { NamedScales } from "./NamedScales";
import { NamedCategoricalScales } from "./NamedCategoricalScales";
import { ShallowSet } from "../ShallowSet";
import { Dataset } from "../../../model/Dataset";
import { LinearColorScale } from "./LinearColorScale";

export const mappingFromScale = (scale: LinearColorScale, attribute, dataset: Dataset) => {
  if (scale.type === 'discrete') {
    // Generate scale
    return new DiscreteMapping(scale, new ShallowSet(dataset.vectors.map(vector => vector[attribute.key])))

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

export function defaultScalesForAttribute(attribute) {
  if (attribute.type == 'categorical') {
    return [
      NamedCategoricalScales.DARK2(),
      NamedCategoricalScales.SET1(),
      new DiscreteScale([
        new SchemeColor("#1f77b4"),
        new SchemeColor("#ff7f0e"),
        new SchemeColor("#2ca02c"),
        new SchemeColor("#d62728"),
        new SchemeColor("#9467bd"),
        new SchemeColor("#8c564b"),
        new SchemeColor("#e377c2"),
        new SchemeColor("#7f7f7f"),
        new SchemeColor("#bcbd22"),
        new SchemeColor("#17becf")
      ])
    ]
  } else {
    return [
      NamedScales.VIRIDIS(),
      NamedScales.RdYlGn(),
      new ContinuosScale([
        new SchemeColor('#fdcc8a'),
        new SchemeColor('#b30000')
      ]),
      new ContinuosScale([
        new SchemeColor('#a6611a'),
        new SchemeColor('#f5f5f5'),
        new SchemeColor('#018571')
      ]),
      new ContinuosScale([
        new SchemeColor('#ca0020'),
        new SchemeColor('#f7f7f7'),
        new SchemeColor('#0571b0')
      ])

    ]
  }

}