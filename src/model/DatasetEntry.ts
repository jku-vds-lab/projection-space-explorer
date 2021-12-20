import { DatasetType } from "./DatasetType";

export type DatasetEntry = {
    display: string
    path: string
    type: DatasetType
    uploaded?: boolean
}