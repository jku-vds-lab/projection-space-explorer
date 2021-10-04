import { IVector } from "../../model/Vector";
import React = require("react");
import { DatasetType } from "../../model/DatasetType";
import { PSEPlugin } from "../../components/Store/PluginScript";
import { GoLegend } from "./GoLegend";

export class GoPlugin extends PSEPlugin {
    type = DatasetType.Go;


    createFingerprint(vectors: IVector[], scale: number = 1, aggregate: boolean): JSX.Element {
        return <GoLegend selection={vectors} aggregate={aggregate}></GoLegend>;
    }
}
