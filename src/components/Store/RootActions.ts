import { IProjection, IBaseProjection } from "../../model/Projection"
import { v4 as uuidv4 } from 'uuid';
import { Dataset } from "../../model";

export enum RootActionTypes {
    RESET = "root/RESET",
    HYDRATE = "root/HYDRATE",
    DATASET = "root/DATASET"
}



export const RootActions = {
    reset: () => ({
        type: RootActionTypes.RESET
    }),
    
    hydrate: (dump: any) => ({
        type: RootActionTypes.HYDRATE,
        dump
    }),

    loadDataset: (dataset: Dataset) => ({
        type: RootActionTypes.DATASET,
        dataset
    })
}