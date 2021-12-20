"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const DatasetType_1 = require("../../model/DatasetType");
const PluginScript_1 = require("../../components/Store/PluginScript");
const GoLegend_1 = require("./GoLegend");
class GoPlugin extends PluginScript_1.PSEPlugin {
    constructor() {
        super(...arguments);
        this.type = DatasetType_1.DatasetType.Go;
    }
    createFingerprint(vectors, scale = 1, aggregate) {
        return React.createElement(GoLegend_1.GoLegend, { selection: vectors, aggregate: aggregate });
    }
}
exports.GoPlugin = GoPlugin;
