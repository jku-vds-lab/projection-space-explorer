import * as d3 from 'd3'
import * as React from 'react'
import './ForceLayout.scss'
import Cluster, { Story } from '../../util/Cluster'
import { GenericFingerprint } from '../../legends/Generic'
import { connect } from 'react-redux'
import { Edge } from '../../util/graphs'
import THREE = require('three')
import { ViewTransform } from '../ViewTransform'
import { GenericChanges } from '../../legends/GenericChanges/GenericChanges'
import { StoryMode } from '../../Reducers/StoryModeReducer'
import { ThrustLayout } from '../../util/ThrustLayout'
import { ClusterMode } from '../../Reducers/ClusterModeReducer'
import { RenderingContextEx } from '../../util/RenderingContextEx'

type ForceLayoutProps = {
    activeStory: Story
    width: number
    height: number
    type: String
    clusterEdges: Edge[]
    camera: THREE.Camera
    dataset: any,
    viewTransform: ViewTransform,
    storyMode: StoryMode
    clusterMode: ClusterMode
}

type ForceLayoutState = {
    physicsRef: React.Ref<HTMLDivElement>
    link: any
    displayClusters: any[],
    differenceClusters: any,
    graphLayout: any,
    labelLayout: any,
    container: any,

    thrustLayout: ThrustLayout,
    differenceLayout: ThrustLayout
}




const mapStateToProps = state => ({
    activeStory: state.activeStory,
    clusterEdges: state.clusterEdges,
    viewTransform: state.viewTransform,
    storyMode: state.storyMode,
    clusterMode: state.clusterMode
})


export var ForceLayout = connect(mapStateToProps, null, null, { forwardRef: true })(class extends React.Component<ForceLayoutProps, ForceLayoutState> {


    constructor(props) {
        super(props)

        this.state = {
            physicsRef: React.createRef(),
            link: null,
            displayClusters: null,
            differenceClusters: null,
            graphLayout: null,
            labelLayout: null,
            container: null,
            thrustLayout: null,
            differenceLayout: null
        }
    }


    worldToScreen(vec) {
        let camera = this.props.camera as any
        return {
            x: (vec.x) * camera.zoom + this.props.width / 2,
            y: (-vec.y) * camera.zoom + this.props.height / 2
        }
    }

    worldToScreenWithOffset(vec) {
        let camera = this.props.camera as any
        return {
            x: (vec.x - this.props.camera.position.x) * camera.zoom + this.props.width / 2,
            y: (-vec.y + this.props.camera.position.y) * camera.zoom + this.props.height / 2
        }
    }


    deleteForceLayout() {
        this.state.thrustLayout?.dispose()
        this.state.differenceLayout?.dispose()
        this.setState({
            link: null,
            displayClusters: null,
            differenceClusters: null,
            thrustLayout: null,
            differenceLayout: null
        })
    }

    createForceLayout() {
        var self = this

        var displayClusters = this.props.activeStory.clusters.map(cluster => {
            var center = cluster.getCenter()
            var screen = this.worldToScreen(center)
            return {
                cluster: cluster,

                forceLabelPosition: center,
                shiftX: 0,
                shiftY: 0,
                x: screen.x,
                y: screen.y,
                center: center,
                id: Math.random()
            }
        })

        var width = this.props.width;
        var height = this.props.height;

        /**var graph = {
            nodes: displayClusters.map(m => {
                // Preinitialize x/y
                var center = m.cluster.getCenter()
                var screen = this.worldToScreen(center)
                return {
                    id: Math.random(),
                    center: center,
                    x: screen.x,
                    y: screen.y
                }
            })
        }**/


        var layout = new ThrustLayout(this.props.viewTransform, 50)
        layout.onTick = (output, links) => {
            output.forEach((node, i) => {
                self.state.displayClusters[i].forceLabelPosition = { x: node.forceLabelPosition.x, y: node.forceLabelPosition.y }
                self.state.displayClusters[i].shiftX = node.shiftX
                self.state.displayClusters[i].shiftY = node.shiftY
                self.state.displayClusters[i].link = node.link
                self.setState({
                    displayClusters: displayClusters
                })
            })
        }
        layout.init({ nodes: displayClusters }, width, height)





        var differenceClusters = this.props.activeStory.edges?.map(clusterEdge => {
            var center = this.middle(clusterEdge.source.getCenter(), clusterEdge.destination.getCenter())
            var screen = this.worldToScreen(center)
            return {
                clusterEdge: clusterEdge,
                forceLabelPosition: center,
                shiftX: 0,
                shiftY: 0,
                x: screen.x,
                y: screen.y,
                center: center,
                id: Math.random()
            }
        })


        var differenceLayout = new ThrustLayout(this.props.viewTransform, 30)
        differenceLayout.onTick = (output, links) => {
            output.forEach((node, i) => {
                self.state.differenceClusters[i].forceLabelPosition = { x: node.forceLabelPosition.x, y: node.forceLabelPosition.y }
                self.state.differenceClusters[i].shiftX = node.shiftX
                self.state.differenceClusters[i].shiftY = node.shiftY
                self.state.differenceClusters[i].link = node.link
                self.setState({
                    differenceClusters: differenceClusters
                })
            })
        }
        differenceLayout.init({ nodes: differenceClusters }, width, height)

        this.setState({
            displayClusters: displayClusters,
            thrustLayout: layout,
            differenceLayout: differenceLayout,
            differenceClusters: differenceClusters
        })
    }


    componentDidUpdate(prevProps) {

        // Create new force layout
        if (this.props.clusterMode == ClusterMode.Univariate && prevProps.activeStory == null && prevProps.activeStory != this.props.activeStory && this.props.activeStory != null) {
            this.createForceLayout()
        }

        // Delete old create new
        if (this.props.clusterMode == ClusterMode.Univariate && prevProps.activeStory != null && prevProps.activeStory != this.props.activeStory && this.props.activeStory != null) {
            this.deleteForceLayout()

            this.createForceLayout()
        }

        // Delete only
        if (this.props.clusterMode == ClusterMode.Univariate && prevProps.activeStory != null && this.props.activeStory == null) {
            this.deleteForceLayout()
        }
    }



    /**
     * Renders the links between the cluster centers and the
     * force-directed fingerprints.
     * 
     * @param ctx the rendering context of the canvas
     */
    renderLinks(ctx: CanvasRenderingContext2D) {
        var offset = this.props.viewTransform.cameraOffsetToScreen()

        if (this.state.displayClusters || this.state.differenceClusters) {
            let link = null
            if (this.state.displayClusters && this.props.storyMode == StoryMode.Cluster) {
                link = this.state.displayClusters.map(e => e.link)
            }
            if (this.state.differenceClusters && this.props.storyMode == StoryMode.Difference) {
                link = this.state.differenceClusters.map(e => e.link)
            }


            ctx.setLineDash([]);
            ctx.strokeStyle = 'rgba(70, 130, 180, 1)'
            ctx.fillStyle = 'rgba(70, 130, 180, 1)'
            ctx.lineWidth = 3 * window.devicePixelRatio;

            link.forEach((d, i) => {
                ctx.beginPath();
                ctx.arc((d.source.x + offset.x) * window.devicePixelRatio, (d.source.y + offset.y) * window.devicePixelRatio, 5 * window.devicePixelRatio, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.arc((d.target.x + offset.x) * window.devicePixelRatio, (d.target.y + offset.y) * window.devicePixelRatio, 5 * window.devicePixelRatio, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();


                ctx.beginPath();
                ctx.moveTo((d.source.x + offset.x) * window.devicePixelRatio, (d.source.y + offset.y) * window.devicePixelRatio)
                ctx.lineTo((d.target.x + offset.x) * window.devicePixelRatio, (d.target.y + offset.y) * window.devicePixelRatio)
                ctx.stroke();
                ctx.closePath();
            })
        }
    }


    renderClusterEdges(ctx: CanvasRenderingContext2D) {
        let context = new RenderingContextEx(ctx, window.devicePixelRatio)
        

        function canvas_arrow(context, fromx, fromy, tox, toy) {
            var headlen = 50; // length of head in pixels
            var dx = tox - fromx;
            var dy = toy - fromy;
            var angle = Math.atan2(dy, dx);
            context.moveTo(fromx, fromy);
            context.lineTo(tox, toy);
            context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
            context.moveTo(tox, toy);
            context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        }

        if (this.props.activeStory && this.props.activeStory.edges) {

            this.props.activeStory.edges.forEach(edge => {
                const { x: x0, y: y0 } = this.props.viewTransform.worldToScreen(edge.source.getCenter())
                const { x: x1, y: y1 } = this.props.viewTransform.worldToScreen(edge.destination.getCenter())

                ctx.strokeStyle = 'rgba(70, 130, 180, 0.5)'
                ctx.lineWidth = 5 * window.devicePixelRatio
                ctx.beginPath();
                canvas_arrow(ctx, x0 * window.devicePixelRatio, y0 * window.devicePixelRatio, x1 * window.devicePixelRatio, y1 * window.devicePixelRatio)
                ctx.stroke();
                ctx.closePath();
            })
        }
    }

    middle(vecA, vecB) {
        return {
            x: vecA.x + (vecB.x - vecA.x) / 2,
            y: vecA.y + (vecB.y - vecA.y) / 2
        }
    }

    render() {
        return <div id="physics" className="ForceLayoutParent" ref={this.state.physicsRef}>
            {
                this.props.storyMode == StoryMode.Cluster && this.state.displayClusters?.map((displayCluster, index) => {
                    return <div
                        key={index}
                        style={{
                            position: 'absolute',
                            left: displayCluster.forceLabelPosition.x + this.props.viewTransform.cameraOffsetToScreen().x,
                            top: displayCluster.forceLabelPosition.y + this.props.viewTransform.cameraOffsetToScreen().y,
                            transform: `translate(${displayCluster.shiftX.toFixed(1)}px, ${displayCluster.shiftY.toFixed(1)}px)`
                        }}
                    >
                        <GenericFingerprint scale={1.5} vectors={displayCluster.cluster.vectors} type={this.props.dataset.info.type}></GenericFingerprint>
                    </div>
                })
            }
            {
                this.props.storyMode == StoryMode.Difference && this.state.differenceClusters?.map((differenceCluster, index) => {
                    return <div
                        key={index}
                        style={{
                            position: 'absolute',
                            left: differenceCluster.forceLabelPosition.x + this.props.viewTransform.cameraOffsetToScreen().x,
                            top: differenceCluster.forceLabelPosition.y + this.props.viewTransform.cameraOffsetToScreen().y,
                            transform: `translate(${differenceCluster.shiftX.toFixed(1)}px, ${differenceCluster.shiftY.toFixed(1)}px)`
                        }}>
                        <GenericChanges vectorsA={differenceCluster.clusterEdge.source.vectors} vectorsB={differenceCluster.clusterEdge.destination.vectors}></GenericChanges>
                    </div>
                })
            }
        </div>
    }
})