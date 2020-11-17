import { Edge } from "../graphs";
import Cluster from "../Cluster";
import { Vect, DataLine, DatasetType, getSegs, PrebuiltFeatures, FeatureType } from "../datasetselector";

/**
 * Dataset class that holds all data, the ranges and additional stuff
 */

export class Dataset {
    vectors: Vect[];
    segments: DataLine[];
    bounds: { x; y; scaleBase; scaleFactor; };
    ranges: any;
    info: { path: string; type: DatasetType; };
    columns: any;

    // The type of the dataset (or unknown if not possible to derive)
    type: DatasetType;

    // dict of 'featureName': featureType
    featureTypes: any;

    // True if the dataset has multiple labels per sample
    multivariateLabels: boolean;

    // True if the dataset has sequential information (line attribute)
    isSequential: boolean;

    // Preselected projection columns.
    preselectedProjectionColumns: string[];

    clusters: Cluster[];

    // The edges between clusters.
    clusterEdges: Edge[];

    constructor(vectors, ranges, preselection, info, featureTypes) {
        this.vectors = vectors;
        this.ranges = ranges;
        this.info = info;
        this.columns = {};
        this.type = this.info.type;

        this.calculateBounds();
        this.calculateColumnTypes(ranges, featureTypes);
        this.checkLabels();

        // If the dataset is sequential, calculate the segments
        this.isSequential = this.checkSequential();
        if (this.isSequential) {
            this.segments = getSegs(this.vectors);
        }

        this.preselectedProjectionColumns = preselection;
    }

    inferRangeForAttribute(key: string) {
        let values = this.vectors.map(sample => sample[key]);
        let numeric = true;
        let min = Number.MAX_SAFE_INTEGER;
        let max = Number.MIN_SAFE_INTEGER;

        values.forEach(value => {
            if (isNaN(value)) {
                numeric = false;
            } else if (numeric) {
                if (value < min) {
                    min = value;
                } else if (value > max) {
                    max = value;
                }
            }
        });

        return numeric ? { min: min, max: max, inferred: false } : null;
    }

    reloadRanges() {
    }

    // Checks if the dataset contains sequential data
    checkSequential() {
        var header = this.getColumns();

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
            if (vector.clusterLabel.length > 1) {
                this.multivariateLabels = true;
                return;
            }
        });
    }

    /**
     * Creates a map which shows the distinct types and data types of the columns.
     */
    calculateColumnTypes(ranges, featureTypes) {
        var columnNames = Object.keys(this.vectors[0]);
        columnNames.forEach(columnName => {
            this.columns[columnName] = {};

            this.columns[columnName].featureType = featureTypes[columnName];

            // Check data type
            if (columnName in ranges) {
                this.columns[columnName].range = ranges[columnName];
            } else {
                if (this.vectors.find(vector => isNaN(vector[columnName]))) {
                    this.columns[columnName].distinct = Array.from(new Set([...this.vectors.map(vector => vector[columnName])]));
                    this.columns[columnName].isNumeric = false;
                } else {
                    this.columns[columnName].isNumeric = true;
                    this.columns[columnName].range = this.inferRangeForAttribute(columnName);
                }
            }
        });
        if ('algo' in this.columns)
            this.columns['algo'].featureType = FeatureType.Categorical;
        if ('clusterLabel' in this.columns)
            this.columns['clusterLabel'].featureType = FeatureType.Categorical;
        if ('clusterProbability' in this.columns)
            this.columns['clusterProbability'].featureType = FeatureType.Quantitative;
        if ('x' in this.columns)
            this.columns['x'].featureType = FeatureType.Quantitative;
        if ('y' in this.columns)
            this.columns['y'].featureType = FeatureType.Quantitative;
    }

    mapProjectionInitialization = entry => {
        return {
            name: entry,
            checked: entry[0] === '*'
        };
    };

    /**
     * Returns an array of columns that are available in the vectors
     */
    getColumns(excludeGenerated = false) {
        var vector = this.vectors[0];

        if (excludeGenerated) {
            const blackList = ["x", "y", "algo", "age", "clusterProbability", "multiplicity", "clusterLabel"];
            return Object.keys(vector).filter(e => e != '__meta__' && !blackList.includes(e));
        } else {
            return Object.keys(vector).filter(e => e != '__meta__');
        }
    }

    /**
     * Returns true if the dataset contains the column.
     */
    hasColumn(column) {
        return this.getColumns().find(e => e == column) != undefined;
    }


    /**
     * Returns the vectors in this dataset as a 2d array, which
     * can be used as input for tsne for example.
     */
    asTensor(columns, samples?) {
        var tensor = [];

        function oneHot(n, length) {
            var arr = new Array(length).fill(0);
            arr[n] = 1;
            return arr;
        }


        (samples ?? this.vectors).forEach(vector => {
            var data = [];
            columns.forEach(entry => {
                let column = entry.name;
                if (this.columns[column].isNumeric) {
                    // Numeric data can just be appended to the array
                    if (column in this.ranges) {
                        let abs = Math.max(Math.abs(this.ranges[column].min), Math.abs(this.ranges[column].max));
                        data.push(+vector[column] / abs);
                    } else {
                        data.push(+vector[column]);
                    }

                } else {
                    // Not numeric data can be converted using one-hot encoding
                    data = data.concat(oneHot(this.columns[column].distinct.indexOf(vector[column]), this.columns[column].distinct.length));
                }
            });
            tensor.push(data);
        });

        return tensor;
    }

    /**
     * Calculates the dataset bounds for this set, eg the minimum and maximum x,y values
     * which is needed for the zoom to work correctly
     */
    calculateBounds() {
        var xAxis = this.vectors.map(vector => vector.x);
        var yAxis = this.vectors.map(vector => vector.y);

        var minX = Math.min(...xAxis);
        var maxX = Math.max(...xAxis);
        var minY = Math.min(...yAxis);
        var maxY = Math.max(...yAxis);

        var scaleBase = 100;
        var absoluteMaximum = Math.max(Math.abs(minX), Math.abs(maxX), Math.abs(minY), Math.abs(maxY));

        this.bounds = {
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
     * Calculates the maximum path length for this dataset.
     */
    getMaxPathLength() {
        if (this.isSequential) {
            return Math.max(...this.segments.map(segment => segment.vectors.length));
        } else {
            return 1;
        }
    }
}
