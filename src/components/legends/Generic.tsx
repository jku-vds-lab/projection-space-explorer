import { NeuralLegend } from "./NeuralDetail/NeuralDetail";
import { CoralLegend } from "./CoralDetail/CoralDetail";
import { TrrackLegend } from "./TrrackDetail/TrrackDetail";
import { StoryLegend } from "./StoryDetail/StoryDetail";
import { GoLegend } from "./GoDetail/GoDetail";
import * as React from 'react'
import { FunctionComponent } from "react";
import { RubikFingerprint } from "./RubikFingerprint/RubikFingerprint";
import { ChessFingerprint } from "./ChessFingerprint/ChessFingerprint";
import { DatasetType } from "../Utility/Data/DatasetType";
import { IVect } from "../Utility/Data/Vect";
import { ChemLegendParent } from "./ChemDetail/ChemDetail";

type GenericLegendProps = {
    type: DatasetType
    vectors: IVect[]
    aggregate: boolean
    hoverUpdate?
    scale?: number
}

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
            return <ChessFingerprint width={144 * scale} height={144 * scale} vectors={vectors}></ChessFingerprint>
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
    vectors: Array<IVect>
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