import { SchemeColor } from "./SchemeColor";
import { ContinuosScale } from "./ContinuosScale";






export var NamedScales = {
  VIRIDIS: () => new ContinuosScale([
    new SchemeColor("#440154"),
    new SchemeColor("#482475"),
    new SchemeColor("#414487"),
    new SchemeColor("#355f8d"),
    new SchemeColor("#2a788e"),
    new SchemeColor("#21908d"),
    new SchemeColor("#22a884"),
    new SchemeColor("#42be71"),
    new SchemeColor("#7ad151"),
    new SchemeColor("#bddf26"),
    new SchemeColor("#bddf26")
  ]),
  RdYlGn: () => new ContinuosScale([
    new SchemeColor("#a50026"),
    new SchemeColor("#d3322b"),
    new SchemeColor("#f16d43"),
    new SchemeColor("#fcab63"),
    new SchemeColor("#fedc8c"),
    new SchemeColor("#f9f7ae"),
    new SchemeColor("#d7ee8e"),
    new SchemeColor("#a4d86f"),
    new SchemeColor("#64bc61"),
    new SchemeColor("#23964f"),
    new SchemeColor("#23964f")
  ])
};
