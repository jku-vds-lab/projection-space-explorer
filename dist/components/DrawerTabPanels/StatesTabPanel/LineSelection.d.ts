import * as React from 'react';
export declare var Checky: ({ checked, onChange, id, name, comp }: {
    checked: any;
    onChange: any;
    id: any;
    name: any;
    comp: any;
}) => JSX.Element;
declare type LegendState = {
    lineChecks: any;
    type: string;
};
declare type LegendProps = {
    onLineSelect: any;
};
export declare class Legend extends React.Component<LegendProps, LegendState> {
    constructor(props: any);
    load(type: any, lineColorScheme: any, algorithms: any): void;
    onCheckbox(event: any): void;
    render(): JSX.Element;
}
export {};
