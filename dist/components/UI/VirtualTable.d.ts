import './VirtualTable.scss';
import * as React from 'react';
type VirtualTableProps = {
    rows: any;
    rowHeight: number;
    tableHeight: number;
};
type VirtualColumnProps = {
    width: number;
    name: string;
    renderer: (row: any) => any;
};
export declare class VirtualColumn extends React.Component<VirtualColumnProps, any> {
}
export declare class VirtualTable extends React.Component<VirtualTableProps, any> {
    constructor(props: any);
    onScroll({ target }: {
        target: any;
    }): void;
    generateRows(): any[];
    render(): JSX.Element;
}
export {};
