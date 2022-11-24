/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { IEdge } from './Edge';
import { ICluster } from './ICluster';
import { FeatureType } from './FeatureType';
import { DatasetType } from './DatasetType';
import { DataLine } from './DataLine';
import type { IVector } from './Vector';
import { mean, std } from '../components/NumTs/NumTs';
import { EncodingMethod } from './EncodingMethod';
import { NormalizationMethod } from './NormalizationMethod';
import { IBaseProjection } from './ProjectionInterfaces';

export enum PrebuiltFeatures {
  Line = 'line',
  ClusterLabel = 'groupLabel',
}
export const EXCLUDED_COLUMNS = ['__meta__', 'x', 'y', 'algo', 'age', 'multiplicity', 'objectType'];
export const EXCLUDED_COLUMNS_ALL = ['__meta__', 'x', 'y', 'algo', 'age', 'multiplicity', 'groupLabel', 'objectType'];

export const DefaultFeatureLabel = 'Default';

const shapes = ['circle', 'star', 'square', 'cross'];

export type ColumnType = {
  distinct: any;
  isNumeric: boolean;
  metaInformation: any;
  featureType: FeatureType;
  range: { max: number; min: number; center?: number };
  featureLabel: string;
  project: boolean;
};

export class SegmentFN {
  /**
   * Calculates the maximum path length for this dataset.
   */
  static getMaxPathLength(dataset: Dataset) {
    if (dataset.isSequential) {
      return Math.max(...dataset.segments.map((segment) => segment.vectors.length));
    }
    return 1;
  }
}

export class ADataset {
  /**
   * Reads out spatial information using the supplied channels.
   */
  static getSpatialData(dataset: Dataset, xChannel?: string, yChannel?: string, positions?: IBaseProjection) {
    if (positions) {
      return positions;
    }
    return dataset.vectors.map((vector) => ({
      x: xChannel ? vector[xChannel] : 0,
      y: yChannel ? vector[yChannel] : 0,
    }));
  }

  /**
   * Returns an array of columns that are available in the vectors
   */
  static getColumns(dataset: Dataset, excludeGenerated = false) {
    const vector = dataset.vectors[0];

    if (excludeGenerated) {
      return Object.keys(vector).filter((e) => !EXCLUDED_COLUMNS_ALL.includes(e));
    }
    return Object.keys(vector).filter((e) => e !== '__meta__');
  }

  /**
   * Returns the vectors in this dataset as a 2d array, which
   * can be used as input for tsne for example.
   */
  static asTensor(dataset: Dataset, projectionColumns, encodingMethod?, normalizationMethod?) {
    if (encodingMethod === undefined) {
      encodingMethod = EncodingMethod.ONEHOT;
    }
    if (normalizationMethod === undefined) {
      normalizationMethod = NormalizationMethod.STANDARDIZE;
    }

    const tensor = [];

    function oneHot(n, length) {
      const arr = new Array(length).fill(0);
      arr[n] = 1;
      return arr;
    }

    const lookup = {};

    dataset.vectors.forEach((vector) => {
      let data = [];
      projectionColumns.forEach((entry) => {
        const column = entry.name;
        if (dataset.columns[column].featureType === FeatureType.Array) {
          const array = JSON.parse(vector[column]);
          data.push(...array);
        } else if (dataset.columns[column].isNumeric) {
          if (dataset.columns[column].range && entry.normalized) {
            if (normalizationMethod === NormalizationMethod.STANDARDIZE) {
              // map to 0 mean and unit standarddeviation
              let m;
              let s;

              if (column in lookup) {
                m = lookup[column].mean;
                s = lookup[column].std;
              } else {
                m = mean(dataset.vectors.map((v) => +v[column]));
                s = std(dataset.vectors.map((v) => +v[column]));

                lookup[column] = {
                  mean: m,
                  std: s,
                };
              }

              if (s <= 0)
                // when all values are equal in a column, the standard deviation can be 0, which would lead to an error
                s = 1;

              data.push((+vector[column] - m) / s);
            } else {
              // map between [0;1]
              let div = dataset.columns[column].range.max - dataset.columns[column].range.min;
              div = div > 0 ? div : 1;
              data.push((+vector[column] - dataset.columns[column].range.min) / div);
            }
          } else {
            data.push(+vector[column]);
          }
        } else if (encodingMethod === EncodingMethod.ONEHOT) {
          // Non numeric data can be converted using one-hot encoding
          const hot_encoded = oneHot(dataset.columns[column].distinct.indexOf(vector[column]), dataset.columns[column].distinct.length);
          data = data.concat(hot_encoded);
        } else {
          // or just be integer encoded
          data.push(dataset.columns[column].distinct.indexOf(vector[column]));
        }
      });
      tensor.push(data);
    });

    const featureTypes = [];
    projectionColumns.forEach((entry) => {
      const column = entry.name;
      switch (dataset.columns[column].featureType) {
        case FeatureType.Binary:
          featureTypes.push(FeatureType.Binary);
          break;
        case FeatureType.Categorical:
          if (encodingMethod === EncodingMethod.ONEHOT) {
            // if the categorical attribute gets one hot encoded, we set all resulting columns to be binary
            featureTypes.concat(Array(dataset.columns[column].distinct.length).fill(FeatureType.Binary));
          } else {
            // otherwise, it is declared as categorical column that contains integer because we can only handle integers in the distance metrics
            featureTypes.push(FeatureType.Categorical);
          }
          break;
        case FeatureType.Date:
          // TODO: handle Date types
          break;
        case FeatureType.Ordinal:
          // TODO: handle Ordinal types
          break;
        case FeatureType.Quantitative:
          featureTypes.push(FeatureType.Quantitative);
          break;
        case FeatureType.String:
          // TODO: handle String types
          break;
        default:
          break;
      }
    });

    return { tensor, featureTypes };
  }
}

/**
 * Dataset class that holds all data, the ranges and additional stuff
 */
export class Dataset {
  vectors: IVector[];

  segments: DataLine[];

  info: { path: string; type: DatasetType };

  columns: { [name: string]: ColumnType };

  // The type of the dataset (or unknown if not possible to derive)
  type: DatasetType;

  // True if the dataset has multiple labels per sample
  multivariateLabels: boolean;

  // True if the dataset has sequential information (line attribute)
  isSequential: boolean;

  // True if the dataset has a projection provided
  hasInitialScalarTypes: boolean;

  clusters: ICluster[];

  // The edges between clusters.
  clusterEdges: IEdge[];

  inferredColumns: string[];

  // Dictionary containing the key/value pairs for each column
  metaInformation;

  categories: any;

  constructor(vectors, ranges, info, featureTypes, metaInformation = {}) {
    this.vectors = vectors;
    this.info = info;
    this.columns = {};
    this.type = this.info.type;
    this.metaInformation = metaInformation;
    this.hasInitialScalarTypes = false;

    this.calculateColumnTypes(ranges, featureTypes, metaInformation);
    this.checkLabels();

    // If the dataset is sequential, calculate the segments
    this.isSequential = this.checkSequential();
    if (this.isSequential) {
      this.segments = this.getSegs();
    }
  }

  getSegs(key = 'line') {
    const { vectors } = this;

    // Get a list of lines that are in the set
    const lineKeys = [...new Set(vectors.map((vector) => vector[key]))];

    const segments = lineKeys.map((lineKey) => {
      const l = new DataLine(
        lineKey,
        vectors.filter((vector) => vector[key] === lineKey).sort((a, b) => a.age - b.age),
      );
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
    const header = ADataset.getColumns(this);

    // If we have no line attribute, its not sequential
    if (!header.includes(PrebuiltFeatures.Line)) {
      return false;
    }

    // If each sample is a different line, its not sequential either
    const set = new Set(this.vectors.map((vector) => vector.line));

    return set.size !== this.vectors.length;
  }

  checkLabels() {
    this.multivariateLabels = false;
    this.vectors.forEach((vector) => {
      if (vector.groupLabel.length > 1) {
        this.multivariateLabels = true;
      }
    });
  }

  inferRangeForAttribute(key: string) {
    const values = this.vectors.map((sample) => sample[key]);
    let numeric = true;
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;

    values.forEach((value) => {
      value = parseFloat(value);
      if (Number.isNaN(value)) {
        numeric = false;
      } else if (numeric) {
        if (value < min) {
          min = value;
        }
        if (value > max) {
          max = value;
        }
      }
    });

    return numeric ? { min, max, inferred: true } : null; // false
  }

  /**
   * Creates a map which shows the distinct types and data types of the columns.
   */
  calculateColumnTypes(ranges, featureTypes, metaInformation) {
    const columnNames = Object.keys(this.vectors[0]);

    if ('algo' in this.columns) this.columns.algo.featureType = FeatureType.Categorical;
    if ('groupLabel' in this.columns) this.columns.groupLabel.featureType = FeatureType.Categorical;
    if ('x' in this.columns) this.columns.x.featureType = FeatureType.Quantitative;
    if ('y' in this.columns) this.columns.y.featureType = FeatureType.Quantitative;

    featureTypes.algo = FeatureType.Categorical;
    delete ranges.algo;

    featureTypes.groupLabel = FeatureType.Categorical;
    delete ranges.groupLabel;

    columnNames.forEach((columnName) => {
      this.columns[columnName] = {} as any;

      this.columns[columnName].featureType = featureTypes[columnName];

      // Store dictionary with key/value pairs in column
      const columnMetaInformation = metaInformation[columnName] ?? {};
      this.columns[columnName].metaInformation = columnMetaInformation;

      // Extract featureLabel from dictionary
      if ('featureLabel' in columnMetaInformation) {
        this.columns[columnName].featureLabel = columnMetaInformation.featureLabel;
      } else {
        this.columns[columnName].featureLabel = DefaultFeatureLabel;
      }

      // Extract included
      if ('project' in columnMetaInformation) {
        this.columns[columnName].project = columnMetaInformation.project;
      } else {
        this.columns[columnName].project = true;
      }

      // Check data type
      if (columnName in ranges) {
        this.columns[columnName].range = ranges[columnName];
      } else if (this.columns[columnName].featureType === FeatureType.Array) {
        this.columns[columnName].isNumeric = false;
      } else if (this.vectors.find((vector) => Number.isNaN(vector[columnName])) || this.columns[columnName].featureType === FeatureType.Categorical) {
        this.columns[columnName].isNumeric = false;
        this.columns[columnName].distinct = Array.from(new Set([...this.vectors.map((vector) => vector[columnName])]));
      } else {
        this.columns[columnName].isNumeric = true;
        this.columns[columnName].range = this.inferRangeForAttribute(columnName);
      }
    });
  }

  /**
   * Infers an array of attributes that can be filtered after, these can be
   * categorical, sequential or continuous attribues.
   * @param {*} ranges
   */
  extractEncodingFeatures() {
    if (this.vectors.length <= 0) {
      return [];
    }

    const shape_options = [];
    const size_options = [];
    const transparency_options = [];
    const color_options = [];

    const { columns } = this;
    const header = Object.keys(columns);
    // var header = Object.keys(this.vectors[0]).filter(a => a != "line");

    header.forEach((key) => {
      if (key === PrebuiltFeatures.ClusterLabel) {
        color_options.push({
          key,
          name: key,
          type: 'categorical',
        });
      } else {
        switch (columns[key].featureType) {
          case FeatureType.Binary:
            color_options.push({
              key,
              name: key,
              type: 'categorical',
            });

            shape_options.push({
              key,
              name: key,
              type: 'categorical',
              values: columns[key].distinct.map((value, index) => {
                return {
                  from: value,
                  to: shapes[index],
                };
              }),
            });
            break;
          case FeatureType.Categorical:
            color_options.push({
              key,
              name: key,
              type: 'categorical',
            });

            if (columns[key].distinct.length <= 4) {
              shape_options.push({
                key,
                name: key,
                type: 'categorical',
                values: columns[key].distinct.map((value, index) => {
                  return {
                    from: value,
                    to: shapes[index],
                  };
                }),
              });
            }
            break;
          case FeatureType.Date:
            break;
          case FeatureType.Ordinal:
            color_options.push({
              key,
              name: key,
              type: 'sequential', // TODO: add ordinal color scale
              range: columns[key].range,
            });
            transparency_options.push({
              key,
              name: key,
              type: 'sequential', // TODO: transparancy for ordered data?
              range: columns[key].range,
              values: {
                range: [0.3, 1.0],
              },
            });
            size_options.push({
              key,
              name: key,
              type: 'sequential', // TODO: size for ordered data?
              range: columns[key].range,
              values: {
                range: [1, 2],
              },
            });
            break;
          case FeatureType.Quantitative:
            color_options.push({
              key,
              name: key,
              type: 'sequential',
              range: columns[key].range,
            });
            transparency_options.push({
              key,
              name: key,
              type: 'sequential',
              range: columns[key].range,
              values: {
                range: [0.3, 1.0],
              },
            });
            size_options.push({
              key,
              name: key,
              type: 'sequential',
              range: columns[key].range,
              values: {
                range: [1, 2],
              },
            });
            break;
          case FeatureType.String:
            break;
          default:
            break;
        }
      }
    });

    const options = [
      {
        category: 'shape',
        attributes: shape_options,
      },
      {
        category: 'size',
        attributes: size_options,
      },
      {
        category: 'transparency',
        attributes: transparency_options,
      },
      {
        category: 'color',
        attributes: color_options,
      },
    ];

    return options;
  }
}
