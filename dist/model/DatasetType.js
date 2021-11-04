"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An enum holding each predefined dataset type like Rubik, Chess etc
 */
var DatasetType;
(function (DatasetType) {
    DatasetType["Rubik"] = "rubik";
    DatasetType["Chess"] = "chess";
    DatasetType["Neural"] = "neural";
    DatasetType["Go"] = "go";
    DatasetType["Test"] = "test";
    DatasetType["Story"] = "story";
    DatasetType["Cohort_Analysis"] = "cohort_analysis";
    DatasetType["Chem"] = "chem";
    DatasetType["Trrack"] = "trrack";
    DatasetType["None"] = "none";
    DatasetType["Subsampled"] = "subsampled";
    DatasetType["Experiments_Only"] = "experiments_only";
    DatasetType["Subsampled_with_Sugestions"] = "subsampled_with_suggestions";
    DatasetType["Experiments_Only_with_Sugestions"] = "experiments_only_with_suggestions";
})(DatasetType = exports.DatasetType || (exports.DatasetType = {}));
