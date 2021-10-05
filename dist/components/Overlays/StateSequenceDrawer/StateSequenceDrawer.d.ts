import './StateSequenceDrawer.scss';
import { Dataset } from "../../../model/Dataset";
declare type StateSequenceDrawerProps = {
    activeLine: string;
    setHighlightedSequence: any;
    highlightedSequence: any;
    dataset: Dataset;
    setActiveLine: any;
    setCurrentAggregation: (select: number[]) => void;
};
export declare const StateSequenceDrawerRedux: import("react-redux").ConnectedComponent<({ activeLine, setHighlightedSequence, dataset, setActiveLine, setCurrentAggregation }: StateSequenceDrawerProps) => JSX.Element, Pick<StateSequenceDrawerProps, never>>;
export {};
