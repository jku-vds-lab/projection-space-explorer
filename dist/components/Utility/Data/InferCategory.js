"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChessFingerprint_1 = require("../../../plugins/Chess/ChessFingerprint/ChessFingerprint");
const RubikFingerprint_1 = require("../../../plugins/Rubik/RubikFingerprint/RubikFingerprint");
const Dataset_1 = require("../../../model/Dataset");
const DatasetType_1 = require("../../../model/DatasetType");
/**
 * Object responsible for infering things from the data structure of a csv file.
 * For example this class can infer the
 * - ranges of columns
 * - type of data file (rubik, story...)
 */
class InferCategory {
    constructor(vectors) {
        this.vectors = vectors;
    }
    /**
     * Infers the type of the dataset from the columns
     * @param {*} header
     */
    inferType() {
        var header = Object.keys(this.vectors[0]);
        // Checks if the header has all the required columns
        const hasLayout = (header, columns) => {
            for (let key in columns) {
                let val = columns[key];
                if (!header.includes(val)) {
                    return false;
                }
            }
            return true;
        };
        if (hasLayout(header, RubikFingerprint_1.requiredRubikColumns)) {
            return DatasetType_1.DatasetType.Rubik;
        }
        if (header.includes('cf00')) {
            return DatasetType_1.DatasetType.Neural;
        }
        if (hasLayout(header, ChessFingerprint_1.requiredChessColumns)) {
            return DatasetType_1.DatasetType.Chess;
        }
        if (header.includes('new_y')) {
            return DatasetType_1.DatasetType.Story;
        }
        if (header.includes('aa')) {
            return DatasetType_1.DatasetType.Go;
        }
        // if (header.toString().toLowerCase().includes('smiles')) {
        //     return DatasetType.Chem;
        // }
        if (header.includes('selectedCoordsNorm')) {
            return DatasetType_1.DatasetType.Trrack;
        }
        return DatasetType_1.DatasetType.None;
    }
    /**
     * Infers an array of attributes that can be filtered after, these can be
     * categorical, sequential or continuous attribues.
     * @param {*} ranges
     */
    load(ranges) {
        if (this.vectors.length <= 0) {
            return [];
        }
        var options = [
            {
                "category": "shape",
                "attributes": []
            },
            {
                "category": "size",
                "attributes": []
            },
            {
                "category": "transparency",
                "attributes": []
            },
            {
                "category": "color",
                "attributes": []
            }
        ];
        var header = Object.keys(this.vectors[0]).filter(a => a != "line");
        header.forEach(key => {
            if (key == Dataset_1.PrebuiltFeatures.ClusterLabel) {
                options.find(e => e.category == "color").attributes.push({
                    "key": key,
                    "name": key,
                    "type": "categorical"
                });
            }
            else {
                // Check for given header key if its categorical, sequential or diverging
                var distinct = [...new Set(this.vectors.map(vector => vector[key]))];
                // numerical values with more than 8 disctinct values
                if ((distinct.length > 8 || key in ranges || key == 'multiplicity') && !distinct.find(value => isNaN(value))) {
                    // If we have a lot of different values, the values or probably sequential data
                    var category = options.find(e => e.category == "color");
                    var min = null, max = null;
                    if (key in ranges) {
                        min = ranges[key].min;
                        max = ranges[key].max;
                    }
                    else {
                        min = Math.min(...distinct);
                        max = Math.max(...distinct);
                    }
                    category.attributes.push({
                        "key": key,
                        "name": key,
                        "type": "sequential",
                        "range": {
                            "min": min,
                            "max": max
                        }
                    });
                    options.find(e => e.category == "transparency").attributes.push({
                        "key": key,
                        "name": key,
                        "type": "sequential",
                        "range": {
                            "min": min,
                            "max": max
                        },
                        "values": {
                            range: [0.3, 1.0]
                        }
                    });
                    options.find(e => e.category == "size").attributes.push({
                        "key": key,
                        "name": key,
                        "type": "sequential",
                        "range": {
                            "min": min,
                            "max": max
                        },
                        "values": {
                            range: [1, 2]
                        }
                    });
                }
                else if (distinct.find(value => isNaN(value)) || key == 'algo') {
                    options.find(e => e.category == 'color').attributes.push({
                        "key": key,
                        "name": key,
                        "type": "categorical"
                    });
                    if (distinct.length <= 4) {
                        var shapes = ["circle", "star", "square", "cross"];
                        options.find(e => e.category == 'shape').attributes.push({
                            "key": key,
                            "name": key,
                            "type": "categorical",
                            "values": distinct.map((value, index) => {
                                return {
                                    from: value,
                                    to: shapes[index]
                                };
                            })
                        });
                    }
                }
            }
        });
        return options;
    }
}
exports.InferCategory = InferCategory;
