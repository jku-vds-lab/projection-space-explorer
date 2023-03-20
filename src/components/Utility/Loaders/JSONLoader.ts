import * as d3v5 from 'd3v5';
import { v4 as uuidv4 } from 'uuid';
import { Loader } from './Loader';
import { FeatureType } from '../../../model/FeatureType';
import { DatasetType } from '../../../model/DatasetType';
import { AVector, IVector } from '../../../model/Vector';
import { InferCategory } from '../Data/InferCategory';
import { Preprocessor } from '../Data/Preprocessor';
import { ADataset, Dataset } from '../../../model/Dataset';
import { ICluster } from '../../../model/ICluster';
import { IEdge } from '../../../model/Edge';
import { ObjectTypes } from '../../../model/ObjectType';

export class JSONLoader implements Loader {
  vectors: IVector[];

  datasetType: DatasetType;

  resolvePath(entry: any, finished: any) {
    d3v5.json(entry.path).then((file) => this.resolve(file, finished, null, { path: '' }));
  }

  resolveContent(content: any, finished: any) {
    const file = JSON.parse(content);
    this.resolve(file, finished, null, { path: '' });
  }

  inferRangeForAttribute(key: string) {
    const values = this.vectors.map((sample) => sample[key]);
    let numeric = true;
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;

    values.forEach((value) => {
      if (Number.isNaN(value)) {
        numeric = false;
      } else if (numeric) {
        if (value < min) {
          min = value;
        } else if (value > max) {
          max = value;
        }
      }
    });

    return numeric ? { min, max } : null;
  }

  parseRange(str) {
    const range = str.match(/-?\d+\.?\d*/g);
    return { min: parseFloat(range[0]), max: parseFloat(range[1]), inferred: true };
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

  async resolve(content, finished, datasetType, entry) {
    const fileSamples = content.samples[0];

    let ranges = {};

    // Parse predefined ranges
    fileSamples.columns.forEach((column, ci) => {
      const matches = column.match(/\[-?\d+\.?\d* *; *-?\d+\.?\d*\]/);
      if (matches) {
        const prefix = column.substring(0, column.length - matches[0].length);

        fileSamples.columns[ci] = prefix;
        ranges[prefix] = this.parseRange(matches[0]);
      }
    });

    this.vectors = [];
    fileSamples.data.forEach((row) => {
      const data = {};
      fileSamples.columns.forEach((column, ci) => {
        data[column] = row[ci];
      });
      this.vectors.push(AVector.create(data));
    });

    const header = Object.keys(this.vectors[0]);
    // infer for each feature whether it contains numeric, date, or arbitrary values
    const contains_number = {};
    const contains_date = {};
    const contains_arbitrary = {};
    this.vectors.forEach((r) => {
      header.forEach((f) => {
        const type = this.getFeatureType(r[f]);
        if (type === 'number') {
          contains_number[f] = true;
        } else if (type === 'date') {
          contains_date[f] = true;
        } else {
          contains_arbitrary[f] = true;
        }
      });
    });
    const types = {};
    // decide the type of each feature - categorical/quantitative/date
    header.forEach((f) => {
      if (contains_number[f] && !contains_date[f] && !contains_arbitrary[f]) {
        // only numbers -> quantitative type
        // (no way to tell if a feature of only numbers should be categorical, even if it is all integers)
        types[f] = FeatureType.Quantitative;
      } else if (!contains_number[f] && contains_date[f] && !contains_arbitrary[f]) {
        // only date -> date type
        types[f] = FeatureType.Date;
      } else {
        // otherwise categorical
        types[f] = FeatureType.Categorical;
      }
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
    for (let i = 0; i < this.vectors.length; i++) {
      // for all date features f
      dateFeatures.forEach((f) => {
        // overwrite sample with its timestamp
        this.vectors[i][f] = Date.parse(this.vectors[i][f]);
      });
      quantFeatures.forEach((f) => {
        // overwrite sample with its timestamp
        this.vectors[i][f] = +this.vectors[i][f];
      });
    }

    this.datasetType = datasetType || new InferCategory(this.vectors).inferType();

    const clusters: ICluster[] = [];
    content.clusters[0].data.forEach((row) => {
      const nameIndex = content.clusters[0].columns.indexOf('name');

      clusters.push({
        id: uuidv4(),
        objectType: ObjectTypes.Cluster,
        label: row[0],
        name: nameIndex >= 0 ? row[nameIndex] : undefined,
        indices: row[1],
      });
    });

    const edges = [];
    content.edges[0].data.forEach((row) => {
      const nameIndex = content.edges[0].columns.indexOf('name');

      const edge: IEdge = {
        id: uuidv4(),
        source: clusters.findIndex((cluster) => cluster.label === row[1]).toString(),
        destination: clusters.findIndex((cluster) => cluster.label === row[2]).toString(),
        objectType: ObjectTypes.Edge,
      };

      if (nameIndex >= 0) {
        edge.name = row[nameIndex];
      }

      edges.push(edge);
    });

    let preselection = null as any[];
    let metaInformation;
    if ('preselection' in content) {
      preselection = content.preselection[0].data.flat();

      metaInformation = {};

      header.forEach((column) => {
        metaInformation[column] = {
          project: preselection.includes(column),
        };
      });
    }
    let inferredColumns = [];
    const preprocessor = new Preprocessor(this.vectors);
    const hasScalarTypes = header.includes('x') && header.includes('y');
    [ranges, inferredColumns] = preprocessor.preprocess(ranges);

    const dataset = ADataset.createDataset(this.vectors, ranges, { type: this.datasetType, path: entry.path }, types, metaInformation);
    dataset.hasInitialScalarTypes = hasScalarTypes;

    dataset.clusters = clusters;
    dataset.clusterEdges = edges;
    dataset.inferredColumns = inferredColumns;
    dataset.categories = ADataset.extractEncodingFeatures(dataset.columns);

    finished(dataset);
  }
}
