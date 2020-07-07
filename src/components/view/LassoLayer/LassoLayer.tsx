import './LassoLayer.scss'
import * as React from 'react'
import { RenderingContextEx } from '../../library/RenderingContextEx'
import { connect } from 'react-redux'
import { ViewTransform } from '../ViewTransform'

type LassoLayerProps = {
    viewTransform: ViewTransform
}

const mapStateToProps = state => ({
    viewTransform: state.viewTransform as ViewTransform
})

export var LassoLayer = connect(mapStateToProps, null, null, {forwardRef: true})(class extends React.Component<LassoLayerProps, any> {
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
        var current = this.props.viewTransform.worldToScreen({ x: highlightedSequence.current.x, y: highlightedSequence.current.y })
        var previous = this.props.viewTransform.worldToScreen({ x: highlightedSequence.previous.x, y: highlightedSequence.previous.y })
        
    }

    getContext() {
        return this.state.canvasRef.current.getContext('2d')
    }

    render() {
        return <canvas id="selection" className="LassoLayerParent" ref={this.state.canvasRef}></canvas>
    }
})