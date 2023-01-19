import { Dataset } from '../../model/Dataset';
import { IVector } from '../../model/Vector';
export type FPOptions = {
    root: 'storytelling' | 'detail' | 'sequence';
};
export declare abstract class PSEPlugin {
    type: string;
    hasFileLayout(header: string[]): boolean;
    abstract createFingerprint(dataset: Dataset, vectors: IVector[], scale: number, aggregate: boolean, options: FPOptions): JSX.Element;
    hasLayout(header: string[], columns: string[]): boolean;
}
//# sourceMappingURL=PSEPlugin.d.ts.map