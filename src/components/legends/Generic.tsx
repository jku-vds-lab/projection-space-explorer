import { RubikLegend } from "./RubikDetail/RubikDetail";
import { NeuralLegend } from "./NeuralDetail/NeuralDetail";
import { ChessLegend } from "./ChessDetail/ChessDetail";
import { CoralLegend } from "./CoralDetail/CoralDetail";
import { TrrackLegend } from "./TrrackDetail/TrrackDetail";
import { StoryLegend } from "./StoryDetail/StoryDetail";
import { GoLegend } from "./GoDetail/GoDetail";

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import * as React from 'react'
import { FunctionComponent } from "react";
import { RubikFingerprint } from "./RubikFingerprint/RubikFingerprint";
import { ChessFingerprint, ChessCapturesFingerprint } from "./ChessFingerprint/ChessFingerprint";
import { DatasetType } from "../Utility/Data/DatasetType";
import { Vect } from "../Utility/Data/Vect";
import { Dataset } from "../Utility/Data/Dataset";
import { ChemLegendParent } from "./ChemDetail/ChemDetail";
import clone = require('fast-clone')

type GenericLegendProps = {
    type: DatasetType
    vectors: Vect[]
    aggregate: boolean
    hoverUpdate?
    scale?: number
}

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
                h1, h2, h3, h4, h5, h6, h7, h8, 
                // bb,bk,bn,bp,bq,br,wb,wk,wn,wp,wq,wr,
                ...rest} = x;
        return rest
    });
    return map
}

const containsAll = (obj, arr) => {
    for(const str of arr){
       if(Object.keys(obj).includes(str)){
          continue;
       }else{
          return false;
       }
    }
    return true;
 };

//shows single and aggregated view
export var GenericLegend = ({ type, vectors, aggregate, hoverUpdate, scale=2}: GenericLegendProps) => {
    switch (type) {
        case DatasetType.Story:
            return <StoryLegend selection={vectors}></StoryLegend>
        case DatasetType.Rubik:
            return <RubikFingerprint vectors={vectors} width={81 * scale} height={108 * scale}></RubikFingerprint>
        case DatasetType.Neural:
            return <NeuralLegend selection={vectors} aggregate={aggregate}></NeuralLegend>
        case DatasetType.Chess:
            if (containsAll(vectors[0], ['bb','bk','bn','bp','bq','br','wb','wk','wn','wp','wq','wr'].map(i => 'captured_' + i))) {
                return <div style={{display: 'flex', flexDirection: 'column'}}><ChessCapturesFingerprint width={144 * scale} height={144*10/8 * scale} vectors={vectors}></ChessCapturesFingerprint><CoralLegend selection={dropChessBoardCoordinates(vectors)} aggregate={aggregate}></CoralLegend></div>
            } else {
                return <div style={{display: 'flex', flexDirection: 'column'}}><ChessFingerprint width={144 * scale} height={144 * scale} vectors={vectors}></ChessFingerprint><CoralLegend selection={dropChessBoardCoordinates(vectors)} aggregate={aggregate}></CoralLegend></div>
            }
        case DatasetType.Cohort_Analysis:
            return <CoralLegend selection={vectors} aggregate={aggregate}></CoralLegend>
        case DatasetType.Trrack:
            return <TrrackLegend selection={vectors} aggregate={aggregate}></TrrackLegend>
        case DatasetType.Go:
            return <GoLegend selection={vectors} aggregate={aggregate}></GoLegend>
        case DatasetType.Chem:
            return <ChemLegendParent selection={vectors} aggregate={aggregate} hoverUpdate={hoverUpdate}></ChemLegendParent>
        default:
            return <CoralLegend selection={vectors} aggregate={aggregate}></CoralLegend>
    }
}



type GenericFingerprintProps = {
    type: DatasetType
    vectors: Array<any>
    scale: number
}

//for storytelling?
export const GenericFingerprint: FunctionComponent<GenericFingerprintProps> = ({ type, vectors, scale }: GenericFingerprintProps) => {
    switch (type) {
        case DatasetType.Rubik:
            return <RubikFingerprint width={81 * scale} height={108 * scale} vectors={vectors}></RubikFingerprint>
        case DatasetType.Chess:
            // return <ChessFingerprint width={150 * scale} height={150 * scale} vectors={vectors}></ChessFingerprint>
            return <div style={{display: 'flex', flexDirection: 'column'}}><ChessFingerprint width={150 * scale} height={150 * scale} vectors={vectors}></ChessFingerprint><CoralLegend selection={dropChessBoardCoordinates(vectors)} aggregate={true}></CoralLegend></div>
        case DatasetType.Neural:
            return <NeuralLegend selection={vectors} aggregate={true}></NeuralLegend>
        case DatasetType.Story:
            return <StoryLegend selection={vectors}></StoryLegend>
        case DatasetType.Cohort_Analysis:
            return <CoralLegend selection={vectors} aggregate={true}></CoralLegend>
        case DatasetType.Go:
            return <GoLegend selection={vectors} aggregate={true}></GoLegend>
        case DatasetType.Chem:
            return <ChemLegendParent selection={vectors} aggregate={true} mcs_only={true}></ChemLegendParent>
        default:
            return <CoralLegend selection={vectors} aggregate={true}></CoralLegend>
    }
}