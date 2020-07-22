import { Vect, Dataset, DatasetType } from "../../util/datasetselector";
import { connect } from 'react-redux'
import { RubikChanges } from "../RubikChanges/RubikChanges";
import React = require("react");
import { ChessChanges } from "../ChessChanges/ChessChanges";


type GenericChangesType = {
    vectorsA: Array<Vect>
    vectorsB: Array<Vect>
    dataset: Dataset
}

const mapStateToProps = state => ({
    dataset: state.dataset
})

const mapDispatchToProps = dispatch => ({
})

export const GenericChanges = connect(mapStateToProps, mapDispatchToProps)(({ vectorsA, vectorsB, dataset } : GenericChangesType) => {
    switch (dataset.type) {
        case DatasetType.Rubik:
            return <RubikChanges vectorsA={vectorsA} vectorsB={vectorsB}></RubikChanges>
        case DatasetType.Chess:
            console.log("creating chess...")
            return <ChessChanges vectorsA={vectorsA} vectorsB={vectorsB}></ChessChanges>
        default:
            return <div></div>
    }
})