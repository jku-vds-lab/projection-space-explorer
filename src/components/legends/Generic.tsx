import { RubikLegend } from "./RubikDetail/RubikDetail";
import { NeuralLegend } from "./NeuralDetail/NeuralDetail";
import { ChessLegend } from "./ChessDetail/ChessDetail";
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
import { DatasetType, Dataset } from "../util/datasetselector";

type GenericLegendProps = {
    type: DatasetType
    vectors: Array<any>
    aggregate: Boolean
}

export var GenericLegend = ({ type, vectors, aggregate }: GenericLegendProps) => {
    switch (type) {
        case DatasetType.Story:
            return <StoryLegend selection={vectors}></StoryLegend>
        case DatasetType.Rubik:
            return <RubikLegend selection={vectors}></RubikLegend>
        case DatasetType.Neural:
            return <NeuralLegend selection={vectors} aggregate={aggregate}></NeuralLegend>
        case DatasetType.Chess:
            return <ChessLegend selection={vectors}></ChessLegend>
        case DatasetType.Go:
            return <GoLegend selection={vectors} aggregate={aggregate}></GoLegend>
        default:
            return <div></div>
    }
}



type GenericFingerprintProps = {
    type: DatasetType
    vectors: Array<any>
    scale: number
}

export const GenericFingerprint: FunctionComponent<GenericFingerprintProps> = ({ type, vectors, scale }: GenericFingerprintProps) => {
    switch (type) {
        case DatasetType.Rubik:
            return <RubikFingerprint width={81 * scale} height={108 * scale} vectors={vectors}></RubikFingerprint>
        case DatasetType.Chess:
            return <ChessFingerprint width={80 * scale} height={80 * scale} vectors={vectors}></ChessFingerprint>
        default:
            return <div></div>
    }
}



export function GenericClusterLegend({ cluster, type }) {
    return <div>
        <Typography variant='subtitle2'>Cluster Information</Typography>
        <TableContainer>
            <Table size="small" aria-label="simple table">
                <TableBody>
                    <TableRow>
                        <TableCell>Probability</TableCell>
                        <TableCell align="right">{cluster.getProbability().toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>STD</TableCell>
                        <TableCell align="right">{cluster.getSTD().toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Score</TableCell>
                        <TableCell align="right">{cluster.meanScore().toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Count</TableCell>
                        <TableCell align="right">{cluster.vectors.length.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Unique Lines</TableCell>
                        <TableCell align="right">{cluster.differentLines().toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Ordering</TableCell>
                        <TableCell align="right">{cluster.order().toFixed(2)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        <div className="speech-bubble-ds-arrow"></div>
    </div>
}