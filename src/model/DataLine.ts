import { IVector } from './Vector';

/**
 * View information for segments
 */
export class DataLineView {
  /**
   * Is this segment visible through the detailed selection? (line selection treeview)
   */
  detailVisible = true;

  /**
   * Is this segment visible through the global switch?
   */
  globalVisible = true;

  /**
   * Is this segment currently highlighted?
   */
  highlighted = false;

  /**
   * Color set for this line
   */
  intrinsicColor = null;

  /**
   * Line mesh
   */
  lineMesh = null;
}

/**
 * Main data class for lines
 */

export class DataLine {
  lineKey: any;

  vectors: IVector[];

  __meta__: DataLineView;

  constructor(lineKey, vectors) {
    this.lineKey = lineKey;
    this.vectors = vectors;

    this.__meta__ = new DataLineView();
  }
}
