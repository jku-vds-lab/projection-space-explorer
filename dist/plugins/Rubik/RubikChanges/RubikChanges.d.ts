import React = require('react');
import { IVector } from '../../../model/Vector';
declare type RubikChangesProps = {
    vectorsA: Array<IVector>;
    vectorsB: Array<IVector>;
    width?: number;
    height?: number;
};
export declare class RubikChanges extends React.Component<RubikChangesProps> {
    canvasRef: any;
    canvasContext: CanvasRenderingContext2D;
    constructor(props: RubikChangesProps);
    componentDidMount(): void;
    renderToContext(): void;
    componentDidUpdate(prevProps: any): void;
    render(): JSX.Element;
}
export {};
