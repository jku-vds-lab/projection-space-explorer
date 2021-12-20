"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FeatureType_1 = require("./FeatureType");
const DataLine_1 = require("./DataLine");
const NumTs_1 = require("../components/NumTs/NumTs");
var PrebuiltFeatures;
(function (PrebuiltFeatures) {
    PrebuiltFeatures["Line"] = "line";
    PrebuiltFeatures["ClusterLabel"] = "groupLabel";
})(PrebuiltFeatures = exports.PrebuiltFeatures || (exports.PrebuiltFeatures = {}));
exports.EXCLUDED_COLUMNS = ["__meta__", "x", "y", "algo", "clusterProbability", "age", "multiplicity", "objectType"];
exports.EXCLUDED_COLUMNS_ALL = ["__meta__", "x", "y", "algo", "clusterProbability", "age", "multiplicity", "groupLabel", "objectType"];
exports.DefaultFeatureLabel = "Default";
class SegmentFN {
    /**
     * Calculates the maximum path length for this dataset.
     */
    static getMaxPathLength(dataset) {
        if (dataset.isSequential) {
            return Math.max(...dataset.segments.map(segment => segment.vectors.length));
        }
        else {
            return 1;
        }
    }
}
exports.SegmentFN = SegmentFN;
class DatasetUtil {
    /**
 * Calculates the dataset bounds for this set, eg the minimum and maximum x,y values
 * which is needed for the zoom to work correctly
 */
    static calculateBounds(dataset) {
        var xAxis = dataset.vectors.map(vector => vector.x);
        var yAxis = dataset.vectors.map(vector => vector.y);
        var minX = Math.min(...xAxis);
        var maxX = Math.max(...xAxis);
        var minY = Math.min(...yAxis);
        var maxY = Math.max(...yAxis);
        var scaleBase = 100;
        var absoluteMaximum = Math.max(Math.abs(minX), Math.abs(maxX), Math.abs(minY), Math.abs(maxY));
        dataset.bounds = {
            scaleBase: scaleBase,
            scaleFactor: absoluteMaximum / scaleBase,
            x: {
                min: minX,
                max: maxX
            },
            y: {
                min: minY,
                max: maxY
            }
        };
    }
    /**
     * Returns an array of columns that are available in the vectors
     */
    static getColumns(dataset, excludeGenerated = false) {
        var vector = dataset.vectors[0];
        if (excludeGenerated) {
            return Object.keys(vector).filter(e => !exports.EXCLUDED_COLUMNS_ALL.includes(e));
        }
        else {
            return Object.keys(vector).filter(e => e != '__meta__');
        }
    }
    /**
 * Returns the vectors in this dataset as a 2d array, which
 * can be used as input for tsne for example.
 */
    static asTensor(dataset, projectionColumns, samples) {
        var tensor = [];
        function oneHot(n, length) {
            var arr = new Array(length).fill(0);
            arr[n] = 1;
            return arr;
        }
        let lookup = {};
        (samples !== null && samples !== void 0 ? samples : dataset.vectors).forEach(vector => {
            var data = [];
            projectionColumns.forEach(entry => {
                let column = entry.name;
                if (dataset.columns[column].isNumeric) {
                    if (dataset.columns[column].range && entry.normalized) {
                        let m, s;
                        if (column in lookup) {
                            m = lookup[column].mean;
                            s = lookup[column].std;
                        }
                        else {
                            m = NumTs_1.mean(dataset.vectors.map(v => +v[column]));
                            s = NumTs_1.std(dataset.vectors.map(v => +v[column]));
                            lookup[column] = {
                                mean: m,
                                std: s
                            };
                        }
                        data.push((+vector[column] - m) / s);
                    }
                    else {
                        data.push(+vector[column]);
                    }
                }
                else {
                    // Not numeric data can be converted using one-hot encoding
                    data = data.concat(oneHot(dataset.columns[column].distinct.indexOf(vector[column]), dataset.columns[column].distinct.length));
                }
            });
            tensor.push(data);
        });
        return tensor;
    }
}
exports.DatasetUtil = DatasetUtil;
/**
 * Dataset class that holds all data, the ranges and additional stuff
 */
class Dataset {
    constructor(vectors, ranges, info, featureTypes, metaInformation = {}) {
        this.vectors = vectors;
        this.info = info;
        this.columns = {};
        this.type = this.info.type;
        this.metaInformation = metaInformation;
        DatasetUtil.calculateBounds(this);
        this.calculateColumnTypes(ranges, featureTypes, metaInformation);
        this.checkLabels();
        // If the dataset is sequential, calculate the segments
        this.isSequential = this.checkSequential();
        if (this.isSequential) {
            this.segments = this.getSegs();
        }
    }
    getSegs(key = 'line') {
        let vectors = this.vectors;
        // Get a list of lines that are in the set
        var lineKeys = [...new Set(vectors.map(vector => vector[key]))];
        var segments = lineKeys.map(lineKey => {
            var l = new DataLine_1.DataLine(lineKey, vectors.filter(vector => vector[key] == lineKey).sort((a, b) => a.age - b.age));
            // Set segment of vectors
            l.vectors.forEach((v, vi) => {
                v.__meta__.sequenceIndex = vi;
            });
            return l;
        });
        return segments;
    }
    // Checks if the dataset contains sequential data
    checkSequential() {
        var header = DatasetUtil.getColumns(this);
        // If we have no line attribute, its not sequential
        if (!header.includes(PrebuiltFeatures.Line)) {
            return false;
        }
        // If each sample is a different line, its not sequential either
        var set = new Set(this.vectors.map(vector => vector.line));
        return set.size != this.vectors.length;
    }
    checkLabels() {
        this.multivariateLabels = false;
        this.vectors.forEach(vector => {
            if (vector.groupLabel.length > 1) {
                this.multivariateLabels = true;
                return;
            }
        });
    }
    inferRangeForAttribute(key) {
        let values = this.vectors.map(sample => sample[key]);
        let numeric = true;
        let min = Number.MAX_SAFE_INTEGER;
        let max = Number.MIN_SAFE_INTEGER;
        values.forEach(value => {
            value = parseFloat(value);
            if (isNaN(value)) {
                numeric = false;
            }
            else if (numeric) {
                if (value < min) {
                    min = value;
                }
                if (value > max) {
                    max = value;
                }
            }
        });
        return numeric ? { min: min, max: max, inferred: true } : null; // false
    }
    /**
     * Creates a map which shows the distinct types and data types of the columns.
     */
    calculateColumnTypes(ranges, featureTypes, metaInformation) {
        var columnNames = Object.keys(this.vectors[0]);
        columnNames.forEach(columnName => {
            var _a;
            // @ts-ignore
            this.columns[columnName] = {};
            this.columns[columnName].featureType = featureTypes[columnName];
            // Store dictionary with key/value pairs in column
            let columnMetaInformation = (_a = metaInformation[columnName]) !== null && _a !== void 0 ? _a : {};
            this.columns[columnName].metaInformation = columnMetaInformation;
            // Extract featureLabel from dictionary
            if ("featureLabel" in columnMetaInformation) {
                this.columns[columnName].featureLabel = columnMetaInformation["featureLabel"];
            }
            else {
                this.columns[columnName].featureLabel = exports.DefaultFeatureLabel;
            }
            // Extract included
            if ("project" in columnMetaInformation) {
                this.columns[columnName].project = columnMetaInformation["project"];
            }
            else {
                this.columns[columnName].project = true;
            }
            // Check data type
            if (columnName in ranges) {
                this.columns[columnName].range = ranges[columnName];
            }
            else {
                if (this.vectors.find(vector => isNaN(vector[columnName]))) {
                    this.columns[columnName].distinct = Array.from(new Set([...this.vectors.map(vector => vector[columnName])]));
                    this.columns[columnName].isNumeric = false;
                }
                else {
                    this.columns[columnName].isNumeric = true;
                    this.columns[columnName].range = this.inferRangeForAttribute(columnName);
                }
            }
        });
        if ('algo' in this.columns)
            this.columns['algo'].featureType = FeatureType_1.FeatureType.Categorical;
        if ('groupLabel' in this.columns)
            this.columns['groupLabel'].featureType = FeatureType_1.FeatureType.Categorical;
        if ('x' in this.columns)
            this.columns['x'].featureType = FeatureType_1.FeatureType.Quantitative;
        if ('y' in this.columns)
            this.columns['y'].featureType = FeatureType_1.FeatureType.Quantitative;
    }
}
exports.Dataset = Dataset;
