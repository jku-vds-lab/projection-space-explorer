import * as React from 'react';
type AttributeType = {
    feature: string;
    show: boolean;
};
export declare function AttributeSelectionTable({ attributes, setAttributes, children, }: {
    attributes: AttributeType[];
    setAttributes: (attributes: AttributeType[]) => void;
    children?: React.ReactNode;
}): JSX.Element;
export {};
//# sourceMappingURL=AttributeSelectionTable.d.ts.map