import React = require('react');
import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
import { PSEPlugin } from '../../components/Store/PSEPlugin';
import { ChessFingerprint } from './ChessFingerprint/ChessFingerprint';

export class ChessPlugin extends PSEPlugin {
  type = DatasetType.Chess;

  hasFileLayout(header: string[]) {
    const requiredChessColumns = [];

    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach((c) => {
      [1, 2, 3, 4, 5, 6, 7, 8].forEach((n) => {
        requiredChessColumns.push(`${c}${n}`);
      });
    });

    return this.hasLayout(header, requiredChessColumns);
  }

  createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element {
    return <ChessFingerprint vectors={vectors} width={144 * scale} height={144 * scale} />;
  }
}
