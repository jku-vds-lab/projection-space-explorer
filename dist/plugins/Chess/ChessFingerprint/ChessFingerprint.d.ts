import * as React from 'react';
export declare const CHESS_TILE_BLACK = "#edeeef";
export declare const CHESS_TILE_WHITE = "#ffffff";
export declare const requiredChessColumns: any[];
type ChessFingerprintProps = {
    vectors: Array<any>;
    width?: number;
    height?: number;
};
export declare class ChessFingerprint extends React.Component<ChessFingerprintProps> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    canvasContext: CanvasRenderingContext2D;
    constructor(props: ChessFingerprintProps);
    renderToContext(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    render(): JSX.Element;
}
export {};
