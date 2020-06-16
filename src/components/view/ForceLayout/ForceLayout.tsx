import * as d3 from 'd3'
import * as React from 'react'
import './ForceLayout.scss'
import Cluster, { Story } from '../../library/Cluster'
import { GenericLegend, GenericFingerprint } from '../../legends/Generic'
import { FingerprintPreview } from '../../clustering/FingerprintPreview/FingerprintPreview'
import { RubikFingerprint } from '../../legends/RubikFingerprint/RubikFingerprint'
import { Container } from '@material-ui/core'
import { connect } from 'react-redux'
import { Edge } from '../../util/graphs'

type ForceLayoutProps = {
    activeStory: Story
    width: number
    height: number
    type: String
    clusterEdges: Edge[]
}

type ForceLayoutState = {
    physicsRef: React.Ref<HTMLDivElement>
    link: any
    displayClusters: Cluster[]
}




const mapStateToProps = state => ({
    activeStory: state.activeStory,
    clusterEdges: state.clusterEdges
})


export var ForceLayout = connect(mapStateToProps, null, null, { forwardRef: true })(class extends React.Component<ForceLayoutProps, ForceLayoutState> {
    constructor(props) {
        super(props)

        this.state = {
            physicsRef: React.createRef()
        }
    }


    worldToScreen(vec) {
        return {
            x: (vec.x) * this.props.camera.zoom + this.props.width / 2,
            y: (-vec.y) * this.props.camera.zoom + this.props.height / 2
        }
    }

    worldToScreenWithOffset(vec) {
        return {
            x: (vec.x - this.props.camera.position.x) * this.props.camera.zoom + this.props.width / 2,
            y: (-vec.y + this.props.camera.position.y) * this.props.camera.zoom + this.props.height / 2
        }
    }

    offsetToScreen() {
        return {
            x: (-this.props.camera.position.x) * this.props.camera.zoom,
            y: (this.props.camera.position.y) * this.props.camera.zoom
        }
    }

    deleteForceLayout() {
        this.state.graphLayout?.stop()
        this.state.laybelLayout?.stop()
        this.state.container.select('#force').remove()

        this.setState({
            link: null,
            displayClusters: null
        })
    }

    createForceLayout() {
        var self = this

        var displayClusters = this.props.activeStory.clusters.map(cluster => {
            cluster.forceLabelPosition = cluster.getCenter()
            cluster.shiftX = 0
            cluster.shiftY = 0
            return cluster
        })

        this.setState({
            displayClusters: displayClusters
        })


        var width = this.props.width;
        var height = this.props.height;

        var graph = {
            nodes: displayClusters.map(m => {
                // Preinitialize x/y
                var center = m.getCenter()
                var screen = this.worldToScreen(center)
                return {
                    id: Math.random(),
                    center: center,
                    x: screen.x,
                    y: screen.y
                }
            })
        }


        var label = {
            'nodes': [],
            'links': []
        };

        graph.nodes.forEach(function (d, i) {
            label.nodes.push({
                node: d
            });
            label.nodes.push({
                node: d,
                x: d.x,
                y: d.y
            });
            label.links.push({
                source: i * 2,
                target: i * 2 + 1
            });
        });

        var labelLayout = d3.forceSimulation(label.nodes)
            .force("charge", d3.forceManyBody().strength(-500))
            .force("collide", d3.forceCollide().radius(10))
            .force("link", d3.forceLink(label.links).distance(50).strength(0.5));

        var graphLayout = d3.forceSimulation(graph.nodes)
            //.force("charge", d3.forceManyBody().strength(-30))
            //.force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(20))
            //.force("x", d3.forceX(width / 2).strength(0.01))
            //.force("y", d3.forceY(height / 2).strength(1))
            //.force("link", d3.forceLink(graph.links).id(function(d) {return d.id; }).distance(50).strength(1))
            .on("tick", ticked);



        var svg = d3.select("#physics").attr("width", width).attr("height", height);
        var container = svg.append("div").attr('id', 'phys');


        var node = container.append("div").attr("class", "nodes")
            .selectAll("div")
            .data(graph.nodes)
            .enter()
            .append("div")
            .style("position", "absolute")

        var labelNode = container.append("div").attr("class", "labelNodes")
            .selectAll("div")
            .data(label.nodes)
            .enter()
            .append("div")
            //.text(function (d, i) { return i % 2 == 0 ? "" : d.node.id; })
            .style("position", "absolute")
            .style("fill", "#555")
            //.style("font-family", "Arial")
            //.style("font-size", 12)
            .style("pointer-events", "none"); // to prevent mouseover/drag capture


        var link = container.append("g").attr("class", "links")
            .selectAll("line")
            .data(label.links)
            .enter()
            .append("line")
            .attr("stroke", "#aaa")
            .attr("stroke-width", "1px");

        this.setState({
            link: link,
            graphLayout: graphLayout,
            labelLayout: labelLayout,
            container: container
        })

        function ticked() {
            node.call(updateNode);
            link.call(updateLink);

            labelLayout.alphaTarget(0.3).restart();
            labelNode.each(function (d, i) {
                if (i % 2 == 0) {
                    d.x = d.node.x;
                    d.y = d.node.y;
                } else {
                    var b = { width: 90, height: 120 }

                    var diffX = d.x - d.node.x;
                    var diffY = d.y - d.node.y;

                    var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                    var shiftX = b.width * (diffX - dist) / (dist * 2);
                    shiftX = Math.max(-b.width, Math.min(0, shiftX));
                    var shiftY = 16;
                    shiftY = b.height * (diffY - dist) / (dist * 2);
                    shiftY = Math.max(-b.height, Math.min(0, shiftY))
                    this.setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");

                    self.state.displayClusters[Math.floor(i / 2)].forceLabelPosition =
                        { x: d.x, y: d.y }
                    self.state.displayClusters[Math.floor(i / 2)].shiftX = shiftX
                    self.state.displayClusters[Math.floor(i / 2)].shiftY = shiftY

                    //self.state.displayClusters[Math.floor(i / 2)].forceLabelPosition = self.state.displayClusters[Math.floor(i / 2)].center

                }
            });

            self.setState({
                displayClusters: self.state.displayClusters
            })

            graphLayout.alphaTarget(0.3).restart();

            var k = 0.2 * this.alpha();

            node.each(function (o, i) {
                var center = self.worldToScreen(o.center)
                o.x += (center.x - o.x) * k;
                o.y += (center.y - o.y) * k;
            });

            labelNode.call(updateNode);

        }

        function updateLink(link) {
            link.attr("x1", function (d) { return fixna(d.source.x); })
                .attr("y1", function (d) { return fixna(d.source.y); })
                .attr("x2", function (d) { return fixna(d.target.x); })
                .attr("y2", function (d) { return fixna(d.target.y); });
        }

        function fixna(x) {
            if (isFinite(x)) return x;
            return 0;
        }


        function updateNode(node) {

            node.style("left", function (d) {
                return fixna(d.x) + "px"
            })
            node.style("top", function (d) {
                return fixna(d.y) + "px"
            })
        }
    }


    componentDidUpdate(prevProps) {

        // Create new force layout
        if (prevProps.activeStory == null && prevProps.activeStory != this.props.activeStory && this.props.activeStory != null) {
            this.createForceLayout()
        }

        // Delete old create new
        if (prevProps.activeStory != null && prevProps.activeStory != this.props.activeStory && this.props.activeStory != null) {
            this.deleteForceLayout()

            this.createForceLayout()
        }

        // Delete only
        if (prevProps.activeStory != null && this.props.activeStory == null) {
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
        var offset = this.offsetToScreen()

        if (this.state.link) {
            ctx.setLineDash([]);
            ctx.strokeStyle = 'rgba(70, 130, 180, 1)'
            ctx.fillStyle = 'rgba(70, 130, 180, 1)'
            ctx.lineWidth = 3 * window.devicePixelRatio;

            this.state.link.each((d, i) => {
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

        if (this.props.clusterEdges) {

            this.props.clusterEdges.forEach(edge => {
                const { x: x0, y: y0 } = this.worldToScreenWithOffset(edge.source.getCenter())
                const { x: x1, y: y1 } = this.worldToScreenWithOffset(edge.destination.getCenter())

                ctx.strokeStyle = 'rgba(70, 130, 180, 0.5)'
                ctx.lineWidth = 5 * window.devicePixelRatio
                ctx.beginPath();
                canvas_arrow(ctx, x0 * window.devicePixelRatio, y0 * window.devicePixelRatio, x1 * window.devicePixelRatio, y1 * window.devicePixelRatio)
                ctx.stroke();
                ctx.closePath();
            })
        }
    }


    render() {
        return <div id="physics" className="ForceLayoutParent" ref={this.state.physicsRef}>
            {
                this.state.displayClusters?.map(displayCluster => {
                    return <div
                        style={{
                            position: 'absolute',
                            left: displayCluster.forceLabelPosition.x + this.offsetToScreen().x,
                            top: displayCluster.forceLabelPosition.y + this.offsetToScreen().y,
                            transform: `translate(${displayCluster.shiftX.toFixed(1)}px, ${displayCluster.shiftY.toFixed(1)}px)`
                        }}
                    >
                        <GenericFingerprint scale={1.5} vectors={displayCluster.vectors} type={this.props.dataset.info.type}></GenericFingerprint>
                    </div>
                })
            }
        </div>
    }
})