import * as React from 'react';
export type DragAndDropProps = {
    handleDrop: Function;
    accept: string;
};
export type DragAndDropState = {
    drag: boolean;
};
export declare class DragAndDrop extends React.Component<DragAndDropProps, DragAndDropState> {
    dropRef: any;
    fileInput: any;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleDrag: (e: any) => void;
    handleDragIn: (e: any) => void;
    handleDragOut: (e: any) => void;
    handleDrop: (e: any) => void;
    render(): JSX.Element;
}
export default DragAndDrop;
