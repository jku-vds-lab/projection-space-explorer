"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const material_2 = require("@mui/material");
const React = require("react");
class DragAndDrop extends React.Component {
    constructor(props) {
        super(props);
        this.handleDrag = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        this.handleDragIn = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dragCounter = 1;
            if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
                this.setState({ drag: true });
            }
        };
        this.handleDragOut = (e) => {
            e.preventDefault();
            e.stopPropagation();
            var rect = this.dropRef.current.getBoundingClientRect();
            if (e.clientY < rect.top || e.clientY >= rect.bottom || e.clientX < rect.left || e.clientX >= rect.right) {
                this.dragCounter = 0;
                this.setState({ drag: false });
            }
        };
        this.handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.setState({ drag: false });
            this.dragCounter = 0;
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                this.props.handleDrop(e.dataTransfer.files);
                //e.dataTransfer.clearData()
            }
        };
        this.state = {
            drag: false
        };
        this.dragCounter = 0;
        this.dropRef = React.createRef();
    }
    componentDidMount() {
        let div = this.dropRef.current;
        div.addEventListener('dragenter', this.handleDragIn);
        div.addEventListener('dragleave', this.handleDragOut);
        div.addEventListener('dragover', this.handleDrag);
        div.addEventListener('drop', this.handleDrop);
    }
    componentWillUnmount() {
        let div = this.dropRef.current;
        div.removeEventListener('dragenter', this.handleDragIn);
        div.removeEventListener('dragleave', this.handleDragOut);
        div.removeEventListener('dragover', this.handleDrag);
        div.removeEventListener('drop', this.handleDrop);
    }
    render() {
        return (React.createElement("div", { id: "master", style: { display: 'inline-block', position: 'relative' }, ref: this.dropRef },
            this.state.drag ?
                React.createElement("div", { style: {
                        border: 'dashed blue 2px',
                        position: 'absolute',
                        borderRadius: '4px',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    } },
                    React.createElement(material_2.Grid, { style: { height: '100%' }, container: true, direction: "column", justifyContent: "center", alignItems: "center" },
                        React.createElement("div", { style: {
                                textAlign: 'center',
                                color: 'grey',
                                fontSize: 24
                            } },
                            React.createElement("div", null, "Drop a file here")))) :
                React.createElement("div", { style: {
                        border: 'dashed grey 2px',
                        position: 'absolute',
                        borderRadius: '4px',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    } },
                    React.createElement(material_2.Grid, { style: { height: '100%' }, container: true, direction: "column", justifyContent: "center", alignItems: "center" },
                        React.createElement("input", { style: { display: 'none' }, id: "contained-button-file", multiple: true, type: "file", onChange: (e) => {
                                this.props.handleDrop(e.target.files);
                            } }),
                        React.createElement("label", { htmlFor: "contained-button-file" },
                            React.createElement(material_1.Button, { variant: "outlined", component: "span" }, "Open File")),
                        React.createElement("div", { style: {
                                textAlign: 'center',
                                color: 'grey',
                                fontSize: 24
                            } },
                            React.createElement("div", null, "Drop a file here")))),
            this.props.children));
    }
}
exports.DragAndDrop = DragAndDrop;
exports.default = DragAndDrop;
