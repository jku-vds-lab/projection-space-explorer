import * as React from 'react';
declare type DragAndDropProps = {
    handleDrop: Function;
    accept: string;
    theme: any;
};
declare const _default: React.ComponentType<Pick<DragAndDropProps, "accept" | "handleDrop"> & import("@material-ui/core/styles/withTheme").ThemedComponentProps>;
export default _default;
