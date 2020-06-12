import './LassoLayer.scss'
import * as React from 'react'

type LassoLayerProps = {
    selectionRef: any
}

export var LassoLayer = function ({ selectionRef }: LassoLayerProps) {
    return <canvas id="selection" className="LassoLayerParent" ref={selectionRef}></canvas>
}