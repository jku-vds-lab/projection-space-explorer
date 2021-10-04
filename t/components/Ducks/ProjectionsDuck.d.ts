import { Embedding } from "../../model/Embedding";
export declare const addProjectionAction: (projection: Embedding) => {
    type: string;
    projection: Embedding;
};
export declare const deleteProjectionAction: (projection: Embedding) => {
    type: string;
    projection: Embedding;
};
export default function projections(state: Embedding[], action: any): Embedding[];
