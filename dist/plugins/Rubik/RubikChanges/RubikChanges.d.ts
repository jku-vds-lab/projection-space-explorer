import { IVector } from "../../../model/Vector";
import React = require("react");
declare type RubikChangesProps = {
    vectorsA: Array<IVector>;
    vectorsB: Array<IVector>;
    width?: number;
    height?: number;
};
export declare class RubikChanges extends React.Component<RubikChangesProps> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    canvasContext: CanvasRenderingContext2D;
    constructor(props: RubikChangesProps);
    componentDidMount(): void;
    renderToContext(): void;
    componentDidUpdate(prevProps: any): void;
    render(): JSX.Element;
}
export {};
