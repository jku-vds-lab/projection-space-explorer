import { SchemeColor } from "./SchemeColor";
import { DiscreteScale } from "./ContinuosScale";






export var NamedCategoricalScales = {
  SET1: () => new DiscreteScale([
    new SchemeColor("#e41a1c"),
    new SchemeColor("#377eb8"),
    new SchemeColor("#4daf4a"),
    new SchemeColor("#984ea3"),
    new SchemeColor("#ff7f00"),
    new SchemeColor("#ffff33"),
    new SchemeColor("#a65628"),
    new SchemeColor("#f781bf"),
    new SchemeColor("#999999")
  ]),
  DARK2: () => new DiscreteScale([
    new SchemeColor("#1b9e77"),
    new SchemeColor("#d95f02"),
    new SchemeColor("#e7298a"),
    new SchemeColor("#7570b3"),
    new SchemeColor("#66a61e"),
    new SchemeColor("#e6ab02"),
    new SchemeColor("#a6761d"),
    new SchemeColor("#666666")
  ])
};
