import { connect } from 'react-redux';
import React = require('react');
import { DatasetType } from '../../model/DatasetType';
import { IVector } from '../../model/Vector';
import { Dataset } from '../../model/Dataset';
import { RubikChanges } from '../../plugins/Rubik/RubikChanges/RubikChanges';
import { ChessChanges } from '../../plugins/Chess/ChessChanges/ChessChanges';
// import { CoralChanges } from '../../plugins/Coral/CoralChanges/CoralChanges';

type GenericChangesType = {
  vectorsA: Array<IVector>;
  vectorsB: Array<IVector>;
  dataset: Dataset;
  scale: number;
};

const mapStateToProps = (state) => ({
  dataset: state.dataset,
});

const mapDispatchToProps = () => ({});

export const GenericChanges = connect(
  mapStateToProps,
  mapDispatchToProps,
)(({ vectorsA, vectorsB, dataset, scale }: GenericChangesType) => {
  switch (dataset.type) {
    case DatasetType.Rubik:
      return <RubikChanges width={81 * scale} height={108 * scale} vectorsA={vectorsA} vectorsB={vectorsB} />;
    case DatasetType.Chess:
      return <ChessChanges width={144 * scale} height={144 * scale} vectorsA={vectorsA} vectorsB={vectorsB} />;
    case DatasetType.Cohort_Analysis:
      return <div />;
    // return <CoralChanges width={80 * scale} height={80 * scale} vectorsA={vectorsA} vectorsB={vectorsB} scale={scale} />;
    default:
      return <div />;
    // return <CoralChanges width={80 * scale} height={80 * scale} vectorsA={vectorsA} vectorsB={vectorsB} scale={scale} />;
  }
});
