import { EmbeddingType } from "../../model/Embedding";
export declare const addProjectionAction: (projection: EmbeddingType) => {
    type: string;
    projection: EmbeddingType;
};
export declare const deleteProjectionAction: (projection: EmbeddingType) => {
    type: string;
    projection: EmbeddingType;
};
export default function projections(state: EmbeddingType[], action: any): EmbeddingType[];
