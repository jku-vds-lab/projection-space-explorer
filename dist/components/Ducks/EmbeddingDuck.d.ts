import { IProjection, IBaseProjection } from "../../model/Projection";
declare enum ActionTypes {
    ADD = "ducks/embedding/ADD",
    DELETE = "ducks/embedding/DELETE",
    UPDATE_ACTIVE = "ducks/embedding/UPDATE"
}
declare type AddAction = {
    type: ActionTypes.ADD;
    projection: IProjection;
};
declare type DeleteAction = {
    type: ActionTypes.DELETE;
    projectionB: IProjection;
};
declare type UpdateAction = {
    type: ActionTypes.UPDATE_ACTIVE;
    workspace: IBaseProjection;
};
export declare const addEmbeddingAction: (projection: IProjection) => {
    type: ActionTypes;
    projection: IProjection;
};
export declare const deleteEmbeddingAction: (projection: IProjection) => {
    type: ActionTypes;
    projection: IProjection;
};
export declare const updateWorkspaceAction: (workspace: IBaseProjection) => {
    type: ActionTypes;
    workspace: IBaseProjection;
};
declare type Action = AddAction | DeleteAction | UpdateAction;
/**
 * Type for embedding state slice
 */
declare type StateType = {
    byId: {
        [id: string]: IProjection;
    };
    allIds: string[];
    workspace: IBaseProjection;
};
export default function embeddings(state: StateType, action: Action): StateType;
export {};
