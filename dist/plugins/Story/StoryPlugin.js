"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const DatasetType_1 = require("../../model/DatasetType");
const PluginScript_1 = require("../../components/Store/PluginScript");
const StoryDetail_1 = require("./StoryDetail/StoryDetail");
class GoPlugin extends PluginScript_1.PSEPlugin {
    constructor() {
        super(...arguments);
        this.type = DatasetType_1.DatasetType.Story;
    }
    createFingerprint(vectors, scale = 1, aggregate) {
        return React.createElement(StoryDetail_1.StoryLegend, { selection: vectors });
    }
}
exports.GoPlugin = GoPlugin;
