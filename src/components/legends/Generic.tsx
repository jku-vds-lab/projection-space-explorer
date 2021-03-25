import { RubikLegend } from "./RubikDetail/RubikDetail";
import { NeuralLegend } from "./NeuralDetail/NeuralDetail";
import { ChessLegend } from "./ChessDetail/ChessDetail";
import { CoralLegend } from "./CoralDetail/CoralDetail";
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
import { ChessFingerprint } from "./ChessFingerprint/ChessFingerprint";
import { DatasetType } from "../Utility/Data/DatasetType";
import { Vect } from "../Utility/Data/Vect";
import { Dataset } from "../Utility/Data/Dataset";
import { ChemLegendParent } from "./ChemDetail/ChemDetail";

type GenericLegendProps = {
    type: DatasetType
    vectors: Vect[]
    aggregate: boolean
    columns?: any
    hoverUpdate?
}

//shows single and aggregated view
export var GenericLegend = ({ type, vectors, aggregate, columns, hoverUpdate }: GenericLegendProps) => {
    switch (type) {
        case DatasetType.Story:
            return <StoryLegend selection={vectors}></StoryLegend>
        case DatasetType.Rubik:
            return <RubikLegend selection={vectors}></RubikLegend>
        case DatasetType.Neural:
            return <NeuralLegend selection={vectors} aggregate={aggregate}></NeuralLegend>
        case DatasetType.Chess:
            return <ChessFingerprint width={250} height={250} vectors={vectors}></ChessFingerprint>
        case DatasetType.Coral:
            return <CoralLegend selection={vectors} aggregate={aggregate}></CoralLegend>
        case DatasetType.Go:
            return <GoLegend selection={vectors} aggregate={aggregate}></GoLegend>
        case DatasetType.Chem:
            return <ChemLegendParent selection={vectors} aggregate={aggregate} columns={columns} hoverUpdate={hoverUpdate}></ChemLegendParent>
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
            return <ChessFingerprint width={150 * scale} height={150 * scale} vectors={vectors}></ChessFingerprint>
        case DatasetType.Neural:
            return <NeuralLegend selection={vectors} aggregate={true}></NeuralLegend>
        case DatasetType.Story:
            return <StoryLegend selection={vectors}></StoryLegend>
        case DatasetType.Coral:
            return <CoralLegend selection={vectors} aggregate={true}></CoralLegend>
        case DatasetType.Go:
            return <GoLegend selection={vectors} aggregate={true}></GoLegend>
        default:
            return <CoralLegend selection={vectors} aggregate={true}></CoralLegend>
    }
}