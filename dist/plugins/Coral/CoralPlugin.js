"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const DatasetType_1 = require("../../model/DatasetType");
const CoralDetail_1 = require("./CoralDetail/CoralDetail");
const PluginScript_1 = require("../../components/Store/PluginScript");
class CoralPlugin extends PluginScript_1.PSEPlugin {
    constructor() {
        super(...arguments);
        this.type = DatasetType_1.DatasetType.Cohort_Analysis;
    }
    createFingerprint(vectors, scale, aggregate) {
        return React.createElement(CoralDetail_1.CoralLegend, { selection: vectors, aggregate: aggregate });
    }
}
exports.CoralPlugin = CoralPlugin;
