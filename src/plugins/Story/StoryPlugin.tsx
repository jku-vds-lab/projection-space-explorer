import { IVector } from "../../model/Vector";
import React = require("react");
import { DatasetType } from "../../model/DatasetType";
import { PSEPlugin } from "../../components/Store/PluginScript";
import { StoryLegend } from "./StoryDetail/StoryDetail";

export class GoPlugin extends PSEPlugin {
    type = DatasetType.Story;

    createFingerprint(vectors: IVector[], scale: number = 1, aggregate: boolean): JSX.Element {
        return <StoryLegend selection={vectors}></StoryLegend>
    }
}
