import * as React from 'react';
export declare type DragAndDropProps = {
    handleDrop: Function;
    accept: string;
};
export declare type DragAndDropState = {
    drag: boolean;
};
export declare class DragAndDrop extends React.Component<DragAndDropProps, DragAndDropState> {
    dragCounter: number;
    dropRef: any;
    fileInput: any;
    constructor(props: any);
    handleDrag: (e: any) => void;
    handleDragIn: (e: any) => void;
    handleDragOut: (e: any) => void;
    handleDrop: (e: any) => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export default DragAndDrop;
