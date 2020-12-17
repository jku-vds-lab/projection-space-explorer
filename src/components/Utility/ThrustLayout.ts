import { CameraTransformations } from "../WebGLView/CameraTransformations";
import d3 = require("d3");

export class ThrustLayout {
    viewTransform: CameraTransformations
    output = []
    labelLayout
    graphLayout
    linkDistance
    onTick

    constructor(viewTransform: CameraTransformations, linkDistance) {
        this.viewTransform = viewTransform
        this.linkDistance = linkDistance
    }

    dispose() {
        this.graphLayout?.stop()
        this.labelLayout?.stop()
    }

    init(graph, width, height) {

        var self = this
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
            self.output.push({
                forceLabelPosition: null,
                shiftX: 0,
                shiftY: 0
            })
        });

        var labelLayout = d3.forceSimulation(label.nodes)
            .force("charge", d3.forceManyBody().strength(-500))
            .force("collide", d3.forceCollide().radius(10))
            .force("link", d3.forceLink(label.links).distance(this.linkDistance).strength(0.5));

        var graphLayout = d3.forceSimulation(graph.nodes)
            .force("collide", d3.forceCollide().radius(20))
            .on("tick", ticked);

        this.labelLayout = labelLayout
        this.graphLayout = graphLayout

        var svg = d3.select("#physics").attr("width", width).attr("height", height);

        
        function ticked() {
            labelLayout.alphaTarget(0.3).restart();

            label.nodes.forEach((d, i) => {
                if (i % 2 == 0) {
                    d.x = d.node.x;
                    d.y = d.node.y;
                } else {
                    var b = { width: 120, height: 166 }

                    var diffX = d.x - d.node.x;
                    var diffY = d.y - d.node.y;

                    var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                    var shiftX = b.width * (diffX - dist) / (dist * 2);
                    shiftX = Math.max(-b.width, Math.min(0, shiftX));
                    var shiftY = 16;
                    shiftY = b.height * (diffY - dist) / (dist * 2);
                    shiftY = Math.max(-b.height, Math.min(0, shiftY))

                    //self.state.displayClusters[Math.floor(i / 2)].forceLabelPosition = { x: d.x, y: d.y }
                    //self.state.displayClusters[Math.floor(i / 2)].shiftX = shiftX
                    //self.state.displayClusters[Math.floor(i / 2)].shiftY = shiftY
                    self.output[Math.floor(i / 2)].forceLabelPosition = { x: d.x, y: d.y }
                    self.output[Math.floor(i / 2)].shiftX = shiftX
                    self.output[Math.floor(i / 2)].shiftY = shiftY
                    self.output[Math.floor(i / 2)].link = label.links[Math.floor(i / 2)]
                }
            })


            graphLayout.alphaTarget(0.3).restart();

            var k = 0.2 * this.alpha();

            graph.nodes.forEach((o, i) => {
                var center = CameraTransformations.worldToScreenWithoutOffset(o.center, self.viewTransform)
                o.x += (center.x - o.x) * k;
                o.y += (center.y - o.y) * k;
            })

            self.onTick(self.output, label.links)
        }
    }
}