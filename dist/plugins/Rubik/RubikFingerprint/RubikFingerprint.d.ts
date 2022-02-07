import * as React from 'react';
declare type RubikFingerprintProps = {
    vectors: Array<any>;
    width?: number;
    height?: number;
};
export declare const requiredRubikColumns: string[];
export declare class RubikFingerprint extends React.Component<RubikFingerprintProps> {
    canvasRef: any;
    canvasContext: CanvasRenderingContext2D;
    constructor(props: RubikFingerprintProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    renderToContext(): void;
    render(): JSX.Element;
}
export {};
