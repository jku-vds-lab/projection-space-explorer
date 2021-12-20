"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchemeColor_1 = require("./SchemeColor");
const ContinuosScale_1 = require("./ContinuosScale");
exports.NamedCategoricalScales = {
    SET1: () => new ContinuosScale_1.DiscreteScale([
        new SchemeColor_1.SchemeColor("#e41a1c"),
        new SchemeColor_1.SchemeColor("#377eb8"),
        new SchemeColor_1.SchemeColor("#4daf4a"),
        new SchemeColor_1.SchemeColor("#984ea3"),
        new SchemeColor_1.SchemeColor("#ff7f00"),
        new SchemeColor_1.SchemeColor("#ffff33"),
        new SchemeColor_1.SchemeColor("#a65628"),
        new SchemeColor_1.SchemeColor("#f781bf"),
        new SchemeColor_1.SchemeColor("#999999")
    ]),
    DARK2: () => new ContinuosScale_1.DiscreteScale([
        new SchemeColor_1.SchemeColor("#1b9e77"),
        new SchemeColor_1.SchemeColor("#d95f02"),
        new SchemeColor_1.SchemeColor("#e7298a"),
        new SchemeColor_1.SchemeColor("#7570b3"),
        new SchemeColor_1.SchemeColor("#66a61e"),
        new SchemeColor_1.SchemeColor("#e6ab02"),
        new SchemeColor_1.SchemeColor("#a6761d"),
        new SchemeColor_1.SchemeColor("#666666")
    ])
};
