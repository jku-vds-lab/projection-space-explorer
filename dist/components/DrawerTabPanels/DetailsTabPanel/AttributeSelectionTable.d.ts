type AttributeType = {
    feature: string;
    show: boolean;
};
type Props = {
    attributes: AttributeType[];
    setAttributes: (attributes: AttributeType[]) => void;
};
export declare function AttributeSelectionTable({ attributes, setAttributes }: Props): JSX.Element;
export {};
//# sourceMappingURL=AttributeSelectionTable.d.ts.map