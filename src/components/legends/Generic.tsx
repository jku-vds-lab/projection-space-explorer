import { CoralLegend } from "../../plugins/Coral/CoralDetail/CoralDetail";
import { TrrackLegend } from "../../plugins/Trrack/TrrackDetail/TrrackDetail";
import { StoryLegend } from "../../plugins/Story/StoryDetail/StoryDetail";
import * as React from 'react'
import { FunctionComponent } from "react";
import { RubikFingerprint } from "../../plugins/Rubik/RubikFingerprint/RubikFingerprint";
import { ChessFingerprint } from "../../plugins/Chess/ChessFingerprint/ChessFingerprint";
import { IVector } from "../../model/Vector";
import { ChemLegendParent } from "../../plugins/Cime/ChemDetail/ChemDetail";
import { PluginRegistry } from "../Store/PluginScript";
import { DatasetType } from "../../model/DatasetType";
import { GoLegend } from "../../plugins/Go/GoLegend";

type GenericLegendProps = {
    type: DatasetType
    vectors: IVector[]
    aggregate: boolean
    scale?: number
}

//shows single and aggregated view
export var GenericLegend = ({ type, vectors, aggregate, scale=2}: GenericLegendProps) => {

    const plugin = PluginRegistry.getInstance().getPlugin(type)
    if (plugin) {
        // use plugin before defaults
        return plugin.createFingerprint(vectors, scale, aggregate)
    } else {
        // defaults... in case no plugin is specific
        switch (type) {
            case DatasetType.Story:
                return <StoryLegend selection={vectors}></StoryLegend>
            case DatasetType.Rubik:
                return <RubikFingerprint vectors={vectors} width={81 * scale} height={108 * scale}></RubikFingerprint>
            case DatasetType.Chess:
                return <ChessFingerprint width={144 * scale} height={144 * scale} vectors={vectors}></ChessFingerprint>
            case DatasetType.Cohort_Analysis:
                return <CoralLegend selection={vectors} aggregate={aggregate}></CoralLegend>
            case DatasetType.Trrack:
                return <TrrackLegend selection={vectors} aggregate={aggregate}></TrrackLegend>
            case DatasetType.Go:
                return <GoLegend selection={vectors} aggregate={aggregate}></GoLegend>
            case DatasetType.Chem:
                return <ChemLegendParent selection={vectors} aggregate={aggregate}></ChemLegendParent>
            default:
                return <CoralLegend selection={vectors} aggregate={aggregate}></CoralLegend>
        }
    }
}