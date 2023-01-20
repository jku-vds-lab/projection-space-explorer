import { ConnectedProps } from 'react-redux';
import { DistanceMetric } from '../../../model/DistanceMetric';
import { NormalizationMethod } from '../../../model/NormalizationMethod';
import { EncodingMethod } from '../../../model/EncodingMethod';
import type { ProjectionColumn } from '../../Ducks';
import { EmbeddingMethod } from '../../../BaseConfig';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    projectionColumns: ProjectionColumn[];
    projectionParams: {
        perplexity: number;
        learningRate: number;
        nNeighbors: number;
        iterations: number;
        seeded: boolean;
        useSelection: boolean;
        method: string;
        distanceMetric: DistanceMetric;
        normalizationMethod: NormalizationMethod;
        encodingMethod: EncodingMethod;
    };
    columns: {
        [name: string]: import("../../../model").ColumnType;
    };
} & {
    setProjectionParams: (value: any) => any;
}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    domainSettings: EmbeddingMethod;
    open: boolean;
    onClose: any;
    onStart: any;
};
declare function GenericSettingsComp({ domainSettings, open, onClose, onStart, projectionParams, setProjectionParams, projectionColumns, columns }: Props): JSX.Element;
export declare const GenericSettings: import("react-redux").ConnectedComponent<typeof GenericSettingsComp, import("react-redux").Omit<{
    projectionColumns: ProjectionColumn[];
    projectionParams: {
        perplexity: number;
        learningRate: number;
        nNeighbors: number;
        iterations: number;
        seeded: boolean;
        useSelection: boolean;
        method: string;
        distanceMetric: DistanceMetric;
        normalizationMethod: NormalizationMethod;
        encodingMethod: EncodingMethod;
    };
    columns: {
        [name: string]: import("../../../model").ColumnType;
    };
} & {
    setProjectionParams: (value: any) => any;
} & {
    domainSettings: EmbeddingMethod;
    open: boolean;
    onClose: any;
    onStart: any;
}, "projectionColumns" | "projectionParams" | "columns" | "setProjectionParams">>;
export {};
//# sourceMappingURL=GenericSettings.d.ts.map