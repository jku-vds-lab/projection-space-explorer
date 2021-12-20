"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const RenderingContextEx_1 = require("../Utility/RenderingContextEx");
const react_redux_1 = require("react-redux");
const CameraTransformations_1 = require("./CameraTransformations");
const mapStateToProps = state => ({
    viewTransform: state.viewTransform
});
const LassoLayer = react_redux_1.connect(mapStateToProps, null, null, { forwardRef: true })(class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canvasRef: React.createRef()
        };
    }
    setDimensions(width, height) {
        this.state.canvasRef.current.setAttribute('width', width);
        this.state.canvasRef.current.setAttribute('height', height);
    }
    renderHighlightedSequence(context, highlightedSequence) {
        var ctx = new RenderingContextEx_1.RenderingContextEx(context, window.devicePixelRatio);
        let current = CameraTransformations_1.CameraTransformations.worldToScreen({ x: highlightedSequence.current.x, y: highlightedSequence.current.y }, this.props.viewTransform);
        ctx.lineWidth = 6;
        //ctx.setLineDash([8, 8])
        //ctx.lineDashOffset = ((performance.now() / 30) % 16) * -1
        if (highlightedSequence.previous) {
            ctx.beginPath();
            let previous = CameraTransformations_1.CameraTransformations.worldToScreen({ x: highlightedSequence.previous.x, y: highlightedSequence.previous.y }, this.props.viewTransform);
            ctx.moveTo(previous.x, previous.y);
            ctx.strokeStyle = "rgba(0.5, 0.5, 0.5, 0.4)";
            ctx.arrowTo(previous.x, previous.y, current.x, current.y, 30);
            ctx.stroke();
            ctx.closePath();
        }
        if (highlightedSequence.next) {
            let next = CameraTransformations_1.CameraTransformations.worldToScreen({ x: highlightedSequence.next.x, y: highlightedSequence.next.y }, this.props.viewTransform);
            ctx.beginPath();
            ctx.moveTo(current.x, current.y);
            ctx.strokeStyle = "rgba(0.5, 0.5, 0.5, 0.6)";
            ctx.arrowTo(current.x, current.y, next.x, next.y, 30);
            ctx.stroke();
        }
    }
    getContext() {
        return this.state.canvasRef.current.getContext('2d');
    }
    render() {
        return React.createElement("canvas", { id: "selection", style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
            }, ref: this.state.canvasRef });
    }
});
exports.LassoLayer = LassoLayer;
