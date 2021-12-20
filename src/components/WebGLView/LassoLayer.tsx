
import * as React from 'react'
import { RenderingContextEx } from '../Utility/RenderingContextEx'
import { connect } from 'react-redux'
import { CameraTransformations } from './CameraTransformations'
import { ViewTransformType } from '../Ducks'

type LassoLayerProps = {
    viewTransform: ViewTransformType
}

const mapStateToProps = state => ({
    viewTransform: state.viewTransform
})

const LassoLayer = connect(mapStateToProps, null, null, { forwardRef: true })(class extends React.Component<LassoLayerProps, any> {
    constructor(props) {
        super(props)

        this.state = {
            canvasRef: React.createRef()
        }
    }

    setDimensions(width, height) {
        this.state.canvasRef.current.setAttribute('width', width)
        this.state.canvasRef.current.setAttribute('height', height)
    }

    renderHighlightedSequence(context: CanvasRenderingContext2D, highlightedSequence: { previous, current, next }) {
        var ctx = new RenderingContextEx(context, window.devicePixelRatio)
        let current = CameraTransformations.worldToScreen({ x: highlightedSequence.current.x, y: highlightedSequence.current.y }, this.props.viewTransform)



        
        ctx.lineWidth = 6
        
        //ctx.setLineDash([8, 8])
        //ctx.lineDashOffset = ((performance.now() / 30) % 16) * -1

        if (highlightedSequence.previous) {
            ctx.beginPath()
            let previous = CameraTransformations.worldToScreen({ x: highlightedSequence.previous.x, y: highlightedSequence.previous.y }, this.props.viewTransform)
            ctx.moveTo(previous.x, previous.y)

            ctx.strokeStyle = "rgba(0.5, 0.5, 0.5, 0.4)"
            ctx.arrowTo(previous.x, previous.y, current.x, current.y, 30)
            ctx.stroke()
            ctx.closePath()
        }
        if (highlightedSequence.next) {
            let next = CameraTransformations.worldToScreen({ x: highlightedSequence.next.x, y: highlightedSequence.next.y }, this.props.viewTransform)
            ctx.beginPath()
            ctx.moveTo(current.x, current.y)
            
            ctx.strokeStyle = "rgba(0.5, 0.5, 0.5, 0.6)"
            ctx.arrowTo(current.x, current.y, next.x, next.y, 30)
            ctx.stroke()
        }
    }

    getContext() {
        return this.state.canvasRef.current.getContext('2d')
    }

    render() {
        return <canvas id="selection" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
        }} ref={this.state.canvasRef}></canvas>
    }
})


export { LassoLayer }