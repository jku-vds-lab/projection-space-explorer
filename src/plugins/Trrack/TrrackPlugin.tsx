import { IVector } from "../../model/Vector";
import React = require("react");
import { DatasetType } from "../../model/DatasetType";
import { PSEPlugin } from "../../components/Store/PSEPlugin";
import { TrrackLegend } from "./TrrackDetail/TrrackDetail";

export class GoPlugin extends PSEPlugin {
    type = DatasetType.Trrack;

    createFingerprint(vectors: IVector[], scale: number = 1, aggregate: boolean): JSX.Element {
        return <TrrackLegend selection={vectors} aggregate={aggregate}></TrrackLegend>
    }
}
