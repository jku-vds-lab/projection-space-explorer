import { IVector } from "../../model/Vector";
import React = require("react");
import { DatasetType } from "../../model/DatasetType";
import { RubikFingerprint } from "./RubikFingerprint/RubikFingerprint";
import { PSEPlugin } from "../../components/Store/PSEPlugin";

export class RubikPlugin extends PSEPlugin {
    type = DatasetType.Rubik;

    hasFileLayout(header: string[]) {
        const requiredRubikColumns = [
            "up00", "up01", "up02", "up10", "up11", "up12", "up20", "up21", "up22",
            "front00", "front01", "front02", "front10", "front11", "front12", "front20", "front21", "front22",
            "right00", "right01", "right02", "right10", "right11", "right12", "right20", "right21", "right22",
            "left00", "left01", "left02", "left10", "left11", "left12", "left20", "left21", "left22",
            "down00", "down01", "down02", "down10", "down11", "down12", "down20", "down21", "down22",
            "back00", "back01", "back02", "back10", "back11", "back12", "back20", "back21", "back22"
        ];


        return this.hasLayout(header, requiredRubikColumns);
    }

    createFingerprint(vectors: IVector[], scale: number = 1, aggregate: boolean): JSX.Element {
        return <RubikFingerprint vectors={vectors} width={81 * scale} height={108 * scale}></RubikFingerprint>;
    }
}
