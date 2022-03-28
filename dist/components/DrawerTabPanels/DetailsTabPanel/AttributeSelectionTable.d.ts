import { ConnectedProps } from 'react-redux';
declare const attributeConnector: import("react-redux").InferableComponentEnhancerWithProps<{
    dataset: import("../../..").Dataset;
}, {}>;
declare type AttributeTablePropsFromRedux = ConnectedProps<typeof attributeConnector>;
declare type AttributeTableProps = AttributeTablePropsFromRedux & {
    attributes: any;
    setAttributes: any;
    children: any;
    btnFullWidth: any;
};
export declare const AttributeSelectionTable: import("react-redux").ConnectedComponent<({ attributes, setAttributes, dataset, btnFullWidth, children }: AttributeTableProps) => JSX.Element, Pick<AttributeTableProps, "children" | "attributes" | "setAttributes" | "btnFullWidth">>;
export {};
