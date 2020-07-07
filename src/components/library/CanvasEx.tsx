import * as React from "react";

/**
 * Canvas extension that works on high dpi displays. This is done by overriding the canvas context
 * to use the correct coordinates.
 */
class CanvasEx extends React.Component {
    render() {
        return <canvas></canvas>
    }
}