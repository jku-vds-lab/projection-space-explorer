import { DatasetType } from "../../Utility/Data/DatasetType";
import { Vect } from "../../Utility/Data/Vect";
import { Dataset } from "../../Utility/Data/Dataset";
import { connect } from 'react-redux'
import { RubikChanges } from "../RubikChanges/RubikChanges";
import React = require("react");
import { ChessChanges } from "../ChessChanges/ChessChanges";
import { CoralChanges } from "../CoralChanges/CoralChanges";


type GenericChangesType = {
    vectorsA: Array<Vect>
    vectorsB: Array<Vect>
    dataset: Dataset
    scale: number
}

const mapStateToProps = state => ({
    dataset: state.dataset
})

const mapDispatchToProps = dispatch => ({
})

export const GenericChanges = connect(mapStateToProps, mapDispatchToProps)(({ vectorsA, vectorsB, dataset, scale } : GenericChangesType) => {
    switch (dataset.type) {
        case DatasetType.Rubik:
            return <RubikChanges width={81 * scale} height={108 * scale} vectorsA={vectorsA} vectorsB={vectorsB}></RubikChanges>
        case DatasetType.Chess:
            return <ChessChanges width={150 * scale} height={150 * scale} vectorsA={vectorsA} vectorsB={vectorsB}></ChessChanges>
        case DatasetType.Coral:
            return <CoralChanges width={80 * scale} height={80 * scale} vectorsA={vectorsA} vectorsB={vectorsB} scale={scale}></CoralChanges>
        default:
            return <CoralChanges width={80 * scale} height={80 * scale} vectorsA={vectorsA} vectorsB={vectorsB} scale={scale}></CoralChanges>
    }
})