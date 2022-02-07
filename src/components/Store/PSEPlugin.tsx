/* eslint-disable @typescript-eslint/no-unused-vars */
import { IVector } from '../../model/Vector';

export abstract class PSEPlugin {
  type: string;

  hasFileLayout(header: string[]) {
    return false;
  }

  abstract createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element;

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
