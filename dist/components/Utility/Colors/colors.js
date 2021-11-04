"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchemeColor_1 = require("./SchemeColor");
const ContinuosScale_1 = require("./ContinuosScale");
const Mapping_1 = require("./Mapping");
const Mapping_2 = require("./Mapping");
const NamedScales_1 = require("./NamedScales");
const NamedCategoricalScales_1 = require("./NamedCategoricalScales");
const ShallowSet_1 = require("../ShallowSet");
exports.mappingFromScale = (scale, attribute, dataset) => {
    if (scale.type === 'discrete') {
        // Generate scale
        return new Mapping_1.DiscreteMapping(scale, new ShallowSet_1.ShallowSet(dataset.vectors.map(vector => vector[attribute.key])));
    }
    if (scale.type === 'continuous') {
        var min = null, max = null;
        if (dataset.columns[attribute.key].range) {
            min = dataset.columns[attribute.key].range.min;
            max = dataset.columns[attribute.key].range.max;
        }
        else {
            var filtered = dataset.vectors.map(vector => vector[attribute.key]);
            max = Math.max(...filtered);
            min = Math.min(...filtered);
        }
        return new Mapping_2.ContinuousMapping(scale, { min: min, max: max });
    }
    return null;
};
function defaultScalesForAttribute(attribute) {
    if (attribute.type == 'categorical') {
        return [
            NamedCategoricalScales_1.NamedCategoricalScales.DARK2(),
            NamedCategoricalScales_1.NamedCategoricalScales.SET1(),
            new ContinuosScale_1.DiscreteScale([
                new SchemeColor_1.SchemeColor("#1f77b4"),
                new SchemeColor_1.SchemeColor("#ff7f0e"),
                new SchemeColor_1.SchemeColor("#2ca02c"),
                new SchemeColor_1.SchemeColor("#d62728"),
                new SchemeColor_1.SchemeColor("#9467bd"),
                new SchemeColor_1.SchemeColor("#8c564b"),
                new SchemeColor_1.SchemeColor("#e377c2"),
                new SchemeColor_1.SchemeColor("#7f7f7f"),
                new SchemeColor_1.SchemeColor("#bcbd22"),
                new SchemeColor_1.SchemeColor("#17becf")
            ])
        ];
    }
    else {
        return [
            NamedScales_1.NamedScales.VIRIDIS(),
            NamedScales_1.NamedScales.RdYlGn(),
            new ContinuosScale_1.ContinuosScale([
                new SchemeColor_1.SchemeColor('#fdcc8a'),
                new SchemeColor_1.SchemeColor('#b30000')
            ]),
            new ContinuosScale_1.ContinuosScale([
                new SchemeColor_1.SchemeColor('#a6611a'),
                new SchemeColor_1.SchemeColor('#f5f5f5'),
                new SchemeColor_1.SchemeColor('#018571')
            ]),
            new ContinuosScale_1.ContinuosScale([
                new SchemeColor_1.SchemeColor('#ca0020'),
                new SchemeColor_1.SchemeColor('#f7f7f7'),
                new SchemeColor_1.SchemeColor('#0571b0')
            ])
        ];
    }
}
exports.defaultScalesForAttribute = defaultScalesForAttribute;
