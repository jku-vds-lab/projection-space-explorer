import { DatasetType } from "../../Utility/Data/DatasetType";
import { Vect } from "../../Utility/Data/Vect";
import { Dataset } from "../../Utility/Data/Dataset";
import { connect } from 'react-redux'
import { RubikChanges } from "../RubikChanges/RubikChanges";
import React = require("react");
import { ChessChanges } from "../ChessChanges/ChessChanges";
import { CoralChanges } from "../CoralChanges/CoralChanges";
import { ChemLegendParent } from "../ChemDetail/ChemDetail";


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

function dropChessBoardCoordinates(vectors) {
    // TODO export to utils

    const map = vectors.map(x => {
        const { a1, a2, a3, a4, a5, a6, a7, a8,
                b1, b2, b3, b4, b5, b6, b7, b8,
                c1, c2, c3, c4, c5, c6, c7, c8,
                d1, d2, d3, d4, d5, d6, d7, d8,
                e1, e2, e3, e4, e5, e6, e7, e8,
                f1, f2, f3, f4, f5, f6, f7, f8,
                g1, g2, g3, g4, g5, g6, g7, g8,
                h1, h2, h3, h4, h5, h6, h7, h8, ...rest} = x;
        return rest
    });
    return map
}

export const GenericChanges = connect(mapStateToProps, mapDispatchToProps)(({ vectorsA, vectorsB, dataset, scale } : GenericChangesType) => {
    switch (dataset.type) {
        case DatasetType.Rubik:
            return <RubikChanges width={81 * scale} height={108 * scale} vectorsA={vectorsA} vectorsB={vectorsB}></RubikChanges>
        case DatasetType.Chess:
            // return <ChessChanges width={144 * scale} height={144 * scale} vectorsA={vectorsA} vectorsB={vectorsB}></ChessChanges>
            return <div style={{display: 'flex', flexDirection: 'column'}}><ChessChanges width={144 * scale} height={144 * scale} vectorsA={vectorsA} vectorsB={vectorsB}></ChessChanges><CoralChanges width={80 * scale} height={80 * scale} vectorsA={vectorsA} vectorsB={vectorsB} scale={scale}></CoralChanges></div>
        case DatasetType.Cohort_Analysis:
            return <CoralChanges width={80 * scale} height={80 * scale} vectorsA={vectorsA} vectorsB={vectorsB} scale={scale}></CoralChanges>
        case DatasetType.Chem:
            return <ChemLegendParent selection={vectorsA} selection_ref={vectorsB} diff={true} aggregate={true} mcs_only={true}></ChemLegendParent>
        default:
            return <CoralChanges width={80 * scale} height={80 * scale} vectorsA={vectorsA} vectorsB={vectorsB} scale={scale}></CoralChanges>
    }
})