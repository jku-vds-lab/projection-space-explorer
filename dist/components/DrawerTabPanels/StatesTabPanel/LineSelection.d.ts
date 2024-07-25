import * as React from 'react';
export declare function Checky({ checked, onChange, id, name, comp }: {
    checked: any;
    onChange: any;
    id: any;
    name: any;
    comp: any;
}): import("react/jsx-runtime").JSX.Element;
type LegendState = {
    lineChecks: any;
    type: string;
};
type LegendProps = {
    onLineSelect: any;
};
export declare class Legend extends React.Component<LegendProps, LegendState> {
    constructor(props: any);
    onCheckbox(event: any): void;
    load(type: any, lineColorScheme: any, algorithms: any): void;
    render(): import("react/jsx-runtime").JSX.Element;
}
export {};
//# sourceMappingURL=LineSelection.d.ts.map