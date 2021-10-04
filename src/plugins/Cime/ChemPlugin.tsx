import { IVector } from "../../model/Vector";
import React = require("react");
import { DatasetType } from "../../model/DatasetType";
import { ChemLegendParent } from "./ChemDetail/ChemDetail";
import { PSEPlugin } from "../../components/Store/PluginScript";

export class ChemPlugin extends PSEPlugin {
    type = DatasetType.Chem;

    createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element {
        return <ChemLegendParent selection={vectors} aggregate={aggregate}></ChemLegendParent>;
    }
}
