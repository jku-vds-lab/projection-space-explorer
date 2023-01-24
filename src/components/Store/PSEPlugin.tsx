/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dataset } from '../../model/Dataset';
import { IVector } from '../../model/Vector';

export type FPOptions = {
  root: 'storytelling' | 'detail' | 'sequence';
};

export abstract class PSEPlugin {
  type: string;

  hasFileLayout(header: string[]) {
    return false;
  }

  abstract createFingerprint(dataset: Dataset, vectors: IVector[], scale: number, aggregate: boolean, options: FPOptions): JSX.Element;

  // Checks if the header has all the required columns
  hasLayout(header: string[], columns: string[]) {
    for (const key in columns) {
      const val = columns[key];

      if (!header.includes(val)) {
        return false;
      }
    }

    return true;
  }
}
