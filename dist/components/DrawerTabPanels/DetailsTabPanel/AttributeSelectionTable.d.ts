import { ConnectedProps } from 'react-redux';
declare const attributeConnector: import("react-redux").InferableComponentEnhancerWithProps<{
    dataset: import("../../..").Dataset;
}, {}>;
type AttributeTablePropsFromRedux = ConnectedProps<typeof attributeConnector>;
type AttributeTableProps = AttributeTablePropsFromRedux & {
    attributes: any;
    setAttributes: any;
    children: any;
    btnFullWidth: any;
};
export declare const AttributeSelectionTable: import("react-redux").ConnectedComponent<({ attributes, setAttributes, dataset, btnFullWidth, children }: AttributeTableProps) => JSX.Element, import("react-redux").Omit<{
    dataset: import("../../..").Dataset;
} & {
    attributes: any;
    setAttributes: any;
    children: any;
    btnFullWidth: any;
}, "dataset">>;
export {};
