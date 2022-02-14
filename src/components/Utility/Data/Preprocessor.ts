/* eslint-disable no-param-reassign */
/* eslint-disable operator-assignment */
import { IVector } from '../../../model/Vector';

/**
 * Class that preprocesses the data set and checks for validity.
 * Will halucinate attributes like x, y, line, algo and multiplicity if
 * they are not present.
 */

const DEFAULT_ALGO = 'all';

export class Preprocessor {
  vectors: IVector[];

  constructor(vectors) {
    this.vectors = vectors;
  }

  /**
   * Returns an array of columns that are available in the vectors
   */
  getColumns() {
    const vector = this.vectors[0];
    return Object.keys(vector).filter((e) => e !== '__meta__');
  }

  hasScalarTypes() {
    const header = Object.keys(this.vectors[0]);
    return header.includes('x') && header.includes('y');
  }

  /**
   * Returns a unique array of distinct line values.
   */
  distinctLines() {
    if (this.getColumns().includes('line')) {
      return [...new Set(this.vectors.map((vector) => vector.line))];
    }
    return [];
  }

  /**
   * Infers the multiplicity attribute for this dataset.
   */
  inferMultiplicity() {
    if (this.getColumns().includes('multiplicity') || !this.getColumns().includes('x') || !this.getColumns().includes('y')) {
      return;
    }

    let distinctLines = this.distinctLines();

    if (distinctLines.length > 0) {
      // Build line pools
      const linePools = {};
      this.distinctLines().forEach((line) => {
        // Dictionary holding the x/y values of the line
        linePools[line] = {};
      });

      // Builds x attributes for linepools
      this.vectors.forEach((vector) => {
        linePools[vector.line][vector.x] = {};
      });

      distinctLines = this.distinctLines();
      // Count multiplicities
      this.vectors.forEach((vector) => {
        distinctLines.forEach((line) => {
          if (linePools[line][vector.x] != null) {
            if (linePools[line][vector.x][vector.y] == null) {
              linePools[line][vector.x][vector.y] = 1;
            } else {
              linePools[line][vector.x][vector.y] = linePools[line][vector.x][vector.y] + 1;
            }
          }
        });
      });

      // Apply multiplicities
      this.vectors.forEach((vector) => {
        vector.multiplicity = linePools[vector.line][vector.x][vector.y];
      });
    } else {
      const pool = {};
      this.vectors.forEach((sample) => {
        if (sample.x in pool) {
          if (sample.y in pool[sample.x]) {
            pool[sample.x][sample.y] = pool[sample.x][sample.y] + 1;
          } else {
            pool[sample.x][sample.y] = 1;
          }
        } else {
          const o = {};
          pool[sample.x] = o;
          o[sample.y] = 1;
        }
      });

      this.vectors.forEach((sample) => {
        sample.multiplicity = pool[sample.x][sample.y];
      });
    }
  }

  preprocess(ranges) {
    this.inferMultiplicity();

    const { vectors } = this;
    const header = Object.keys(vectors[0]);

    // If data contains no x and y attributes, its invalid
    if (header.includes('x') && header.includes('y')) {
      vectors.forEach((vector) => {
        vector.x = +vector.x;
        vector.y = +vector.y;
      });
    } else {
      // In case we are missing x and y columns, we can just generate a uniformly distributed point cloud
      vectors.forEach((vector) => {
        vector.x = (Math.random() - 0.5) * 100;
        vector.y = (Math.random() - 0.5) * 100;
      });
    }

    // If data contains no line attribute, add one
    if (header.includes('line') && !header.includes('age')) {
      const segs = {};
      const distinct = [...new Set(vectors.map((vector) => vector.line))];
      distinct.forEach((a) => {
        segs[a] = 0;
      });
      vectors.forEach((vector) => {
        // vector.age = segs[vector.line]
        segs[vector.line] = segs[vector.line] + 1;
      });
      const cur = {};
      distinct.forEach((a) => {
        cur[a] = 0;
      });
      vectors.forEach((vector) => {
        vector.age = cur[vector.line] / segs[vector.line];
        cur[vector.line] = cur[vector.line] + 1;
      });
      ranges.age = { min: 0, max: 1 };
    }

    // If data has no algo attribute, add DEFAULT_ALGO
    if (!header.includes('algo')) {
      vectors.forEach((vector) => {
        vector.algo = DEFAULT_ALGO;
      });
    }

    vectors.forEach(function (d) {
      if ('age' in d) {
        d.age = +d.age;
      }
    });

    // If data has no cluster labels, add default ones
    if (!header.includes('groupLabel')) {
      vectors.forEach((vector) => {
        vector.groupLabel = [];
      });
    } else {
      // Support multivariate points ... eg each groupLabel is actually an array
      vectors.forEach((vector) => {
        try {
          if (Number.isNaN(vector.groupLabel)) {
            // convert string to array
            vector.groupLabel = JSON.parse(vector.groupLabel as never);
          } else if ((vector.groupLabel as unknown) < 0) {
            vector.groupLabel = [];
          } else {
            vector.groupLabel = [vector.groupLabel];
          }
        } catch {
          // default is empty array
          vector.groupLabel = [];
        }
      });
    }

    return ranges;
  }
}
