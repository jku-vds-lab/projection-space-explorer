import * as React from 'react';
declare type DragAndDropProps = {
    handleDrop: Function;
    accept: string;
};
declare type DragAndDropState = {
    drag: boolean;
};
declare class DragAndDrop extends React.Component<DragAndDropProps, DragAndDropState> {
    dragCounter: number;
    dropRef: any;
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
