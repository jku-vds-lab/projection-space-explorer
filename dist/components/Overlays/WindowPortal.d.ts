import React = require("react");
export declare class MyWindowPortal extends React.PureComponent<any> {
    externalWindow: any;
    containerEl: any;
    constructor(props: any);
    render(): React.ReactPortal;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
