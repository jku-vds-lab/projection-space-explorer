"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchemeColor_1 = require("./SchemeColor");
const ContinuosScale_1 = require("./ContinuosScale");
exports.NamedScales = {
    VIRIDIS: () => new ContinuosScale_1.ContinuosScale([
        new SchemeColor_1.SchemeColor("#440154"),
        new SchemeColor_1.SchemeColor("#482475"),
        new SchemeColor_1.SchemeColor("#414487"),
        new SchemeColor_1.SchemeColor("#355f8d"),
        new SchemeColor_1.SchemeColor("#2a788e"),
        new SchemeColor_1.SchemeColor("#21908d"),
        new SchemeColor_1.SchemeColor("#22a884"),
        new SchemeColor_1.SchemeColor("#42be71"),
        new SchemeColor_1.SchemeColor("#7ad151"),
        new SchemeColor_1.SchemeColor("#bddf26"),
        new SchemeColor_1.SchemeColor("#bddf26")
    ]),
    RdYlGn: () => new ContinuosScale_1.ContinuosScale([
        new SchemeColor_1.SchemeColor("#a50026"),
        new SchemeColor_1.SchemeColor("#d3322b"),
        new SchemeColor_1.SchemeColor("#f16d43"),
        new SchemeColor_1.SchemeColor("#fcab63"),
        new SchemeColor_1.SchemeColor("#fedc8c"),
        new SchemeColor_1.SchemeColor("#f9f7ae"),
        new SchemeColor_1.SchemeColor("#d7ee8e"),
        new SchemeColor_1.SchemeColor("#a4d86f"),
        new SchemeColor_1.SchemeColor("#64bc61"),
        new SchemeColor_1.SchemeColor("#23964f"),
        new SchemeColor_1.SchemeColor("#23964f")
    ])
};
