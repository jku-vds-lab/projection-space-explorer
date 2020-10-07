
import React = require('react')
import { connect } from 'react-redux'
import Cluster from '../../util/Cluster'
import { ViewTransform } from '../ViewTransform'
import './ClusterLayer.scss'

type ClusterLayerProps = {
    clusters: Cluster[]
    viewTransform: ViewTransform
}

function ClusterLayerFull({ clusters, viewTransform }: ClusterLayerProps) {
    console.log("hello")
    return <svg className="ClusterLayerParent" >
        {clusters?.map(cluster => {
            let center = cluster.getCenter()
            let screen = viewTransform.worldToScreen(center)
            return <circle cx={screen.x} cy={screen.y} r="40" stroke="black" strokeWidth="3" fill="red" />
        })}
    </svg>
}

const mapStateToProps = state => ({
    clusters: state.currentClusters,
    viewTransform: state.viewTransform
})

export const ClusterLayer = connect(mapStateToProps)(ClusterLayerFull)