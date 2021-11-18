import { IProjection, IBaseProjection } from "../../model/Projection"
import { v4 as uuidv4 } from 'uuid';

export enum RootActionTypes {
    RESET = "root/RESET",
    HYDRATE = "root/HYDRATE"
}

export const RootActions = {
    reset: () => ({
        type: RootActionTypes.RESET
    }),
    
    hydrate: (dump: any) => ({
        type: RootActionTypes.HYDRATE,
        dump
    })
}