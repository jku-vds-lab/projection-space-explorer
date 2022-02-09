/* eslint-disable @typescript-eslint/naming-convention */
import * as d3v5 from 'd3v5';
import { v4 as uuidv4 } from 'uuid';
import { FeatureType } from '../../../model/FeatureType';
import { DatasetType } from '../../../model/DatasetType';
import { IVector, AVector } from '../../../model/Vector';
import { InferCategory } from '../Data/InferCategory';
import { Preprocessor } from '../Data/Preprocessor';
import { Dataset, DefaultFeatureLabel } from '../../../model/Dataset';
import { Loader } from './Loader';
import { ICluster } from '../../../model/ICluster';
import { ObjectTypes } from '../../../model/ObjectType';
import WorkerCluster from '../../workers/cluster.worker';
import { DatasetEntry } from '../../../model/DatasetEntry';

function convertFromCSV(vectors) {
  return vectors.map((vector) => {
    return AVector.create(vector);
  });
}

export class CSVLoader implements Loader {
  vectors: IVector[];

  datasetType: DatasetType;

  resolvePath(entry: DatasetEntry, finished) {
    d3v5.csv(entry.path).then((vectors) => {
      this.vectors = convertFromCSV(vectors);
      this.datasetType = entry.type;

      this.resolve(finished, this.vectors, this.datasetType, entry);
    });
  }

  parseRange(str) {
    const range = str.match(/-?\d+\.?\d*/g);
    return { min: range[0], max: range[1], inferred: true };
  }

  resolveContent(content, finished) {
    const vectors = convertFromCSV(d3v5.csvParse(content));
    this.resolveVectors(vectors, finished);
  }

  resolveVectors(vectors, finished) {
    this.vectors = convertFromCSV(vectors);
    this.datasetType = new InferCategory(this.vectors).inferType();

    this.resolve(finished, this.vectors, this.datasetType, { display: '', type: this.datasetType, path: '' });
  }

  getFeatureType(x) {
    if (typeof x === 'number' || !Number.isNaN(Number(x))) {
      return 'number';
    }
    if (`${new Date(x)}` !== 'Invalid Date') {
      return 'date';
    }
    return 'arbitrary';
  }

  getClusters(vectors: IVector[], callback) {
    const worker = new WorkerCluster();

    worker.onmessage = (e) => {
      // Point clustering
      const clusters = new Array<ICluster>();
      Object.keys(e.data).forEach((k) => {
        const t = e.data[k];
        clusters.push({
          id: uuidv4(),
          objectType: ObjectTypes.Cluster,
          indices: t.points.map((i) => i.meshIndex),
          hull: t.hull,
          triangulation: t.triangulation,
          label: k,
        });
      });

      callback(clusters);
    };

    worker.postMessage({
      type: 'extract',
      message: vectors.map((vector) => [vector.x, vector.y, vector.groupLabel]),
    });
  }

  async resolve(finished, vectors, datasetType, entry: DatasetEntry): Promise<Dataset> {
    const header = Object.keys(vectors[0]);

    let ranges = header.reduce((map, value) => {
      const matches = value.match(/\[-?\d+\.?\d* *; *-?\d+\.?\d* *;? *.*\]/);
      if (matches != null) {
        const cutHeader = value.substring(0, value.length - matches[0].length);
        vectors.forEach((vector) => {
          vector[cutHeader] = vector[value];
          delete vector[value];
        });
        // header[header.indexOf(value)] = cutHeader
        map[cutHeader] = this.parseRange(matches[0]);
      }
      return map;
    }, {});

    // Check for JSON header inside column, store it as key/value pair
    const metaInformation = header.reduce((map, value) => {
      const json = value.match(/[{].*[}]/);
      if (json != null) {
        const cutHeader = value.substring(0, value.length - json[0].length);

        vectors.forEach((vector) => {
          vector[cutHeader] = vector[value];
          delete vector[value];
        });
        map[cutHeader] = JSON.parse(json[0]);
      } else {
        map[value] = { featureLabel: DefaultFeatureLabel };
      }
      return map;
    }, {});

    let index = 0;
    const types = {};
    // decide the type of each feature - categorical/quantitative/date
    header.forEach(() => {
      const current_key = Object.keys(metaInformation)[index];
      const col_meta = metaInformation[current_key];
      if (col_meta?.dtype) {
        switch (col_meta.dtype) {
          case 'numerical':
            types[current_key] = FeatureType.Quantitative;
            break;
          case 'date':
            types[current_key] = FeatureType.Date;
            break;
          case 'categorical':
            types[current_key] = FeatureType.Categorical;
            break;
          case 'string':
            types[current_key] = FeatureType.String;
            break;
          case 'array':
            types[current_key] = FeatureType.Array;
            break;
          default:
            types[current_key] = FeatureType.String;
            break;
        }
      } else {
        // infer for each feature whether it contains numeric, date, or arbitrary values
        const contains_number = {};
        const contains_date = {};
        const contains_arbitrary = {};
        vectors.forEach((r) => {
          const type = this.getFeatureType(r[current_key]);
          if (type === 'number') {
            contains_number[current_key] = true;
          } else if (type === 'date') {
            contains_date[current_key] = true;
          } else {
            contains_arbitrary[current_key] = true;
          }
        });

        if (contains_number[current_key] && !contains_date[current_key] && !contains_arbitrary[current_key]) {
          // only numbers -> quantitative type
          types[current_key] = FeatureType.Quantitative;
        } else if (!contains_number[current_key] && contains_date[current_key] && !contains_arbitrary[current_key]) {
          // only date -> date type
          types[current_key] = FeatureType.Date;
        } else {
          // otherwise categorical
          types[current_key] = FeatureType.Categorical;
        }
      }
      index++;
    });

    // replace date features by their numeric timestamp equivalent
    // and fix all quantitative features to be numbers
    // list of filter headers for date
    const dateFeatures = [];
    const quantFeatures = [];
    for (const key in types) {
      if (types[key] === FeatureType.Date) {
        dateFeatures.push(key);
      } else if (types[key] === FeatureType.Quantitative) {
        quantFeatures.push(key);
      }
    }
    // for all rows
    for (let i = 0; i < vectors.length; i++) {
      // for all date features f
      dateFeatures.forEach((f) => {
        // overwrite sample with its timestamp
        vectors[i][f] = Date.parse(vectors[i][f]);
      });
      quantFeatures.forEach((f) => {
        // overwrite sample with its timestamp
        vectors[i][f] = +vectors[i][f];
      });
    }

    const preprocessor = new Preprocessor(vectors);
    const hasScalarTypes = preprocessor.hasScalarTypes();
    ranges = preprocessor.preprocess(ranges);
    

    const dataset = new Dataset(vectors, ranges, { type: datasetType, path: entry.path }, types, metaInformation);
    dataset.hasInitialScalarTypes = hasScalarTypes;

    const promise = new Promise<Dataset>((resolve) => {
      this.getClusters(vectors, (clusters) => {
        dataset.clusters = clusters;

        // Reset cluster label after extraction
        dataset.vectors.forEach((vector) => {
          vector.groupLabel = [];
        });

        dataset.categories = dataset.extractEncodingFeatures(ranges);

        resolve(dataset);

        // Backwards compatibility
        if (finished) {
          finished(dataset);
        }
      });
    });

    return promise;
  }
}
