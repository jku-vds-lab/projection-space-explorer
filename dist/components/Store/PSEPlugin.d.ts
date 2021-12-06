import { IVector } from "../../model/Vector";
export declare abstract class PSEPlugin {
    type: string;
    hasFileLayout(header: string[]): boolean;
    abstract createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element;
    hasLayout(header: string[], columns: string[]): boolean;
}
