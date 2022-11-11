import { Dataset } from '../../model/Dataset';
declare type StateSequenceDrawerProps = {
    activeLine: string;
    setHighlightedSequence: any;
    dataset: Dataset;
    setActiveLine: any;
    setCurrentAggregation: (select: number[]) => void;
};
/**
 * The StateSequenceDrawer is the UI element that is shown when one line is selected by the line selection tool. In this case
 * the user wants to navigate the sequence of one line only.
 */
declare function StateSequenceDrawer({ activeLine, setHighlightedSequence, dataset, setActiveLine, setCurrentAggregation }: StateSequenceDrawerProps): JSX.Element;
export declare const StateSequenceDrawerRedux: import("react-redux").ConnectedComponent<typeof StateSequenceDrawer, import("react-redux").Omit<StateSequenceDrawerProps, "activeLine" | "dataset" | "setHighlightedSequence" | "setActiveLine" | "setCurrentAggregation">>;
export {};
