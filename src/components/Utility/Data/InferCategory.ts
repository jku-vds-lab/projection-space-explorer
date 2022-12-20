import { requiredChessColumns } from '../../../plugins/Chess/ChessFingerprint/ChessFingerprint';
import { requiredRubikColumns } from '../../../plugins/Rubik/RubikFingerprint/RubikFingerprint';
import { DatasetType } from '../../../model/DatasetType';
import { IVector } from '../../../model/Vector';

/**
 * Object responsible for infering things from the data structure of a csv file.
 * For example this class can infer the
 * - ranges of columns
 * - type of data file (rubik, story...)
 */
export class InferCategory {
  vectors: IVector[];

  constructor(vectors) {
    this.vectors = vectors;
  }

  /**
   * Infers the type of the dataset from the columns
   * @param {*} header
   */
  inferType() {
    const header = Object.keys(this.vectors[0]);

    // Checks if the header has all the required columns
    const hasLayout = (columns: string[]) => {
      // eslint-disable-next-line guard-for-in
      for (const key in columns) {
        const val = columns[key];

        if (!header.includes(val)) {
          return false;
        }
      }

      return true;
    };

    if (hasLayout(requiredRubikColumns)) {
      return DatasetType.Rubik;
    }

    if (header.includes('wav')) {
      return DatasetType.Sound;
    }

    if (header.includes('cf00')) {
      return DatasetType.Neural;
    }

    if (hasLayout(requiredChessColumns)) {
      return DatasetType.Chess;
    }

    if (header.includes('new_y')) {
      return DatasetType.Story;
    }

    if (header.includes('aa')) {
      return DatasetType.Go;
    }

    // if (header.toString().toLowerCase().includes('smiles')) {
    //     return DatasetType.Chem;
    // }

    if (header.includes('selectedCoordsNorm')) {
      return DatasetType.Trrack;
    }

    return DatasetType.None;
  }
}
