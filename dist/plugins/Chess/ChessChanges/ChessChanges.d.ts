import * as React from 'react';
import { IVector } from '../../../model/Vector';
type ChessChangesProps = {
    vectorsA: Array<IVector>;
    vectorsB: Array<IVector>;
    width?: number;
    height?: number;
};
export declare class ChessChanges extends React.Component<ChessChangesProps> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    canvasContext: CanvasRenderingContext2D;
    constructor(props: ChessChangesProps);
    renderToContext(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=ChessChanges.d.ts.map