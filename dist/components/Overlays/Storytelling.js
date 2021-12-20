"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Cluster_1 = require("../../model/Cluster");
const Generic_1 = require("../legends/Generic");
const material_1 = require("@mui/material");
const react_redux_1 = require("react-redux");
const DatasetType_1 = require("../../model/DatasetType");
const GenericChanges_1 = require("../legends/GenericChanges");
const StoriesDuck_1 = require("../Ducks/StoriesDuck");
const Close_1 = require("@mui/icons-material/Close");
const SkipPrevious_1 = require("@mui/icons-material/SkipPrevious");
const PlayArrow_1 = require("@mui/icons-material/PlayArrow");
const SkipNext_1 = require("@mui/icons-material/SkipNext");
const Stop_1 = require("@mui/icons-material/Stop");
const resize_observer_1 = require("resize-observer");
const AggregationDuck_1 = require("../Ducks/AggregationDuck");
const mainColor = '#007dad';
const mapStateToProps = (state) => ({
    dataset: state.dataset,
    stories: state.stories,
    currentAggregation: state.currentAggregation,
    genericFingerprintAttributes: state.genericFingerprintAttributes
});
const mapDispatch = dispatch => ({
    addClusterToTrace: cluster => dispatch(StoriesDuck_1.addClusterToTrace(cluster)),
    setActiveTraceState: (cluster) => dispatch(StoriesDuck_1.setActiveTraceState(cluster)),
    selectSideBranch: (index) => dispatch(StoriesDuck_1.selectSideBranch(index)),
    setActiveTrace: (trace) => dispatch(StoriesDuck_1.setActiveTrace(trace)),
    setSelectedCluster: (clusters, shift) => dispatch(AggregationDuck_1.selectClusters(clusters, shift))
});
const connector = react_redux_1.connect(mapStateToProps, mapDispatch);
const Plus = ({ onClick, x, y, r }) => {
    return React.createElement("g", { onClick: () => {
            onClick();
        } },
        React.createElement("circle", { cx: x, cy: y, r: r, fill: "#F0F0F0", strokeWidth: "2", stroke: "#DCDCDC" }),
        React.createElement("line", { x1: x - r + 3, y1: y, x2: x + r - 3, y2: y, strokeWidth: "2", stroke: "#007dad" }),
        React.createElement("line", { x1: x, y1: y - r + 3, x2: x, y2: y + r - 3, strokeWidth: "2", stroke: "#007dad" }));
};
const Circle = ({ x, y, onClick }) => {
    return React.createElement("circle", { cx: x, cy: y, r: "6", fill: "blue", onClick: onClick });
};
const SidePath = ({ dataset, syncPart, width, stroke, fill, x, y, height }) => {
    return React.createElement(material_1.Tooltip, { placement: "left", title: React.createElement(React.Fragment, null,
            React.createElement("div", { style: { display: 'flex', flexDirection: 'column' } }, syncPart.map(node => {
                return React.createElement(Generic_1.GenericLegend, { type: dataset.type, vectors: node.vectors, scale: 1, aggregate: true });
            }))) },
        React.createElement("rect", { x: x - width / 2, y: y, rx: "5", ry: "5", width: width, height: height, strokeWidth: 2, stroke: stroke, fill: fill }));
};
class ProvenanceGraph extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageOffset: 0
        };
    }
    render() {
        const midX = 80;
        const rectWidth = 16;
        const margin = 12;
        const grayColor = '#808080';
        const fillColors = ['#DCDCDC', '#DCDCDC'];
        const strokeColors = [grayColor, grayColor];
        const stateSize = 12;
        if (!this.props.input)
            return null;
        let { position, stories, elementHeight } = this.props.input;
        let currentAggregation = this.props.currentAggregation;
        let selectSideBranch = this.props.selectSideBranch;
        let addClusterToTrace = this.props.addClusterToTrace;
        let dataset = this.props.dataset;
        let pageOffset = this.state.pageOffset;
        let numSidePaths = Math.min(2, stories.trace.sidePaths.length);
        return React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("svg", { style: {
                        width: '100%',
                        height: '100%',
                        maxWidth: '120px',
                        minHeight: position && position.length > 0 ? position[position.length - 1].y + 100 : 200,
                        minWidth: '100px'
                    } },
                    function () {
                        let components = [];
                        for (let si = 0; si < numSidePaths; si++) {
                            let sidePathIndex = stories.trace.sidePaths.indexOf(stories.trace.sidePaths[(si + pageOffset) % stories.trace.sidePaths.length]);
                            let sidePath = stories.trace.sidePaths[sidePathIndex];
                            components.push(React.createElement("g", { key: sidePathIndex }, 
                            // Rectangles between outgoing and ingoing sync nodes
                            sidePath.syncNodes.map((node, i) => {
                                let x = midX - rectWidth * (si + 1) - margin * (si + 1) + rectWidth / 2;
                                // @ts-ignore
                                if (i == sidePath.syncNodes.length - 1 && node.out) {
                                    // Case where its the last syncnode and its outgoing
                                    // @ts-ignore
                                    let pos1 = position[node.index];
                                    return React.createElement("g", { onClick: () => {
                                            selectSideBranch(sidePathIndex);
                                        } },
                                        React.createElement("path", { d: `M ${midX - stateSize / 2} ${pos1.y} Q ${x} ${pos1.y} ${x} ${pos1.y + 35}`, stroke: strokeColors[si], fill: "transparent", strokeWidth: "2" }),
                                        React.createElement("line", { x1: x, y1: pos1.y + 35 + 70 - 6, x2: x, y2: pos1.y + elementHeight, stroke: strokeColors[si] }),
                                        React.createElement(SidePath, { dataset: dataset, syncPart: [], x: x, width: rectWidth, stroke: strokeColors[si], fill: fillColors[si], y: pos1.y + 35, height: elementHeight - 70 }),
                                        React.createElement("rect", { x: x - 6, y: pos1.y + elementHeight - 6, width: stateSize, height: stateSize, fill: fillColors[si], transform: `rotate(45,${x},${pos1.y + elementHeight})` }));
                                }
                                else 
                                // @ts-ignore
                                if (node.out && i != sidePath.syncNodes.length - 1 && sidePath.syncNodes[i + 1].in) {
                                    // @ts-ignore
                                    let i1 = sidePath.syncNodes[i].index;
                                    // @ts-ignore
                                    let i2 = sidePath.syncNodes[i + 1].index;
                                    let sync1 = position[i1];
                                    let sync2 = position[i2];
                                    let syncLen = sidePath.nodes.indexOf(stories.trace.mainPath[i2]) - sidePath.nodes.indexOf(stories.trace.mainPath[i1]) - 1;
                                    let syncPart = sidePath.nodes.slice(sidePath.nodes.indexOf(stories.trace.mainPath[i1]) + 1, sidePath.nodes.indexOf(stories.trace.mainPath[i2]));
                                    let lineY1 = sync1.y;
                                    let lineY2 = sync2.y;
                                    if (i2 - i1 == 1 || true) {
                                        return React.createElement("g", { onClick: () => {
                                                selectSideBranch(sidePathIndex);
                                            } },
                                            React.createElement("path", { d: `M ${midX} ${lineY1} Q ${x} ${lineY1} ${x} ${lineY1 + 35}`, stroke: strokeColors[si], fill: "transparent", strokeWidth: "2" }),
                                            React.createElement("path", { d: `M ${midX} ${lineY2} Q ${x} ${lineY2} ${x} ${lineY2 - 35}`, stroke: strokeColors[si], fill: "transparent", strokeWidth: "2" }),
                                            React.createElement(SidePath, { dataset: dataset, syncPart: syncPart, x: x, width: rectWidth, stroke: strokeColors[si], fill: fillColors[si], y: sync1.y + 35, height: sync2.y - sync1.y - 70 }),
                                            React.createElement("text", { x: x, y: sync1.y + (sync2.y - sync1.y) / 2, textAnchor: "middle" }, syncLen));
                                    }
                                    else {
                                        return React.createElement("g", null);
                                    }
                                }
                                else {
                                    return React.createElement("g", null);
                                }
                            })));
                        }
                        return React.createElement("g", null, components);
                    }(),
                    position.map((p, i) => {
                        if (i != position.length - 1) {
                            let p1 = p;
                            let p2 = position[i + 1];
                            return React.createElement("line", { key: `${p.x}${p.y}`, x1: midX, y1: p1.y, x2: midX, y2: p2.y, stroke: mainColor, strokeWidth: "2" });
                        }
                        else {
                            let p1 = p;
                            let p2 = { x: p1.x, y: p1.y + 40 };
                            return React.createElement("g", { key: `${p.x}${p.y}` },
                                React.createElement("line", { x1: midX, y1: p1.y, x2: midX, y2: p2.y, stroke: mainColor, strokeWidth: "2" }),
                                React.createElement(Plus, { x: midX, y: p2.y, r: 10, onClick: () => {
                                        let cluster = Cluster_1.ACluster.fromSamples(this.props.dataset, currentAggregation.aggregation);
                                        addClusterToTrace(cluster);
                                    } }));
                        }
                    }),
                    position.length == 0 && React.createElement("g", { key: "plusmarker" },
                        React.createElement("line", { x1: midX, y1: 0, x2: midX, y2: 100, stroke: mainColor, strokeWidth: "2" }),
                        React.createElement(Plus, { x: midX, y: 100, r: 10, onClick: () => {
                                if (currentAggregation.aggregation.length > 0) {
                                    let cluster = Cluster_1.ACluster.fromSamples(this.props.dataset, this.props.currentAggregation.aggregation);
                                    addClusterToTrace(cluster);
                                }
                            } }),
                        React.createElement("text", { x: 60, y: 120, textAnchor: "middle", fontFamily: "sans-serif", fontSize: "12" },
                            React.createElement("tspan", { x: "60", dy: "1.2em" }, "Select points and"),
                            React.createElement("tspan", { x: "60", dy: "1.2em" }, "start a story"))),
                    position.map((p, index) => {
                        let cluster = stories.trace.mainPath[index];
                        return React.createElement("g", { key: `${p.x}${p.y}` },
                            stories.activeTraceState === cluster && React.createElement("circle", { cx: midX, cy: p.y, r: stateSize, fill: 'transparent', stroke: mainColor, strokeWidth: "2" }),
                            React.createElement("rect", { x: midX - 6, y: p.y - 6, width: stateSize, height: stateSize, fill: currentAggregation.selectedClusters.includes(cluster) ? mainColor : grayColor, transform: `rotate(45,${midX},${p.y})`, onClick: () => this.props.onClusterClicked(cluster) }));
                    }))));
    }
}
exports.Storytelling = connector(function ({ dataset, stories, currentAggregation, addClusterToTrace, setActiveTraceState, setActiveTrace, selectSideBranch, setSelectedCluster }) {
    var _a;
    if (stories.trace === null || stories.active === null) {
        return null;
    }
    const itemRef = React.useRef();
    const [playing, setPlaying] = React.useState(null);
    const [dirtyFlag, setDirtyFlag] = React.useState(0);
    const [input, setInput] = React.useState(null);
    React.useEffect(() => {
        const observer = new resize_observer_1.ResizeObserver(() => {
            setDirtyFlag(Math.random());
        });
        observer.observe(itemRef.current);
        return () => {
            if (playing) {
                clearInterval(playing);
            }
            if (observer && itemRef.current) {
                observer.unobserve(itemRef.current);
            }
        };
    }, []);
    React.useEffect(() => {
        const current = itemRef.current;
        if (current) {
            const state = [];
            let elementHeight = 0;
            let firstDiv = 0;
            for (var i = 1; i < current.children.length; i++) {
                const child = current.children[i];
                elementHeight = child.offsetHeight;
                const fingerprint = child.childNodes.item(1);
                if (i == 1) {
                    // @ts-ignore
                    firstDiv = child.childNodes.item(0).offsetHeight + child.childNodes.item(1).offsetHeight / 2 + 16;
                }
                state.push({
                    // @ts-ignore
                    y: child.firstChild.offsetTop - itemRef.current.offsetTop + child.firstChild.offsetHeight / 2,
                    height: child.offsetHeight,
                    // @ts-ignore
                    textY: child.firstChild.offsetTop,
                    mainEdge: stories.trace.mainEdges[i - 1]
                });
            }
            setInput({
                stories: stories,
                position: state,
                elementHeight: elementHeight,
                firstDiv: firstDiv
            });
        }
    }, [stories, dirtyFlag]);
    React.useEffect(() => {
        if (stories.trace && stories.trace.mainPath.length > 0) {
            setActiveTraceState(stories.trace.mainPath[0]);
            setSelectedCluster([stories.trace.mainPath[0]], false);
        }
    }, [stories.trace]);
    return React.createElement(material_1.Card, { style: {
            flex: '0 0 auto',
            borderRadius: '0px'
        }, variant: "outlined" },
        React.createElement("div", { style: {
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            } },
            React.createElement(material_1.CardHeader, { style: { paddingBottom: 0 }, action: React.createElement(material_1.IconButton, { onClick: () => {
                        setActiveTrace(null);
                    } },
                    React.createElement(Close_1.default, null)), title: "Storytelling" }),
            React.createElement("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                } },
                React.createElement(material_1.IconButton, { "aria-label": "previous", onClick: () => {
                        if (stories.activeTraceState) {
                            let i = stories.trace.mainPath.indexOf(stories.activeTraceState);
                            let c = null;
                            if (i == 0) {
                                c = stories.trace.mainPath[stories.trace.mainPath.length - 1];
                            }
                            else {
                                c = stories.trace.mainPath[(i - 1) % stories.trace.mainPath.length];
                            }
                            setActiveTraceState(c);
                            setSelectedCluster([c], false);
                        }
                        else {
                            setActiveTraceState(stories.trace.mainPath[0]);
                            setSelectedCluster([stories.trace.mainPath[0]], false);
                        }
                    } },
                    React.createElement(SkipPrevious_1.default, null)),
                React.createElement(material_1.IconButton, { "aria-label": "play/pause", onClick: () => {
                        if (playing) {
                            clearInterval(playing);
                            setPlaying(null);
                        }
                        else {
                            let interval = setInterval(() => {
                                let btn = document.getElementById('nextBtn');
                                if (btn) {
                                    btn.click();
                                }
                                else {
                                    if (playing) {
                                        clearInterval(playing);
                                    }
                                }
                            }, 2000);
                            setPlaying(interval);
                        }
                    } }, playing ? React.createElement(Stop_1.default, null) : React.createElement(PlayArrow_1.default, null)),
                React.createElement(material_1.IconButton, { "aria-label": "next", id: "nextBtn", onClick: () => {
                        if (stories.activeTraceState) {
                            let i = stories.trace.mainPath.indexOf(stories.activeTraceState);
                            let c = stories.trace.mainPath[(i + 1) % stories.trace.mainPath.length];
                            setActiveTraceState(c);
                            setSelectedCluster([c], false);
                        }
                        else {
                            setActiveTraceState(stories.trace.mainPath[0]);
                            setSelectedCluster([stories.trace.mainPath[0]], false);
                        }
                    } },
                    React.createElement(SkipNext_1.default, null))),
            React.createElement("div", { style: { overflowY: 'auto' } },
                React.createElement("div", { style: {
                        display: 'flex',
                        flexDirection: 'row',
                        padding: '8px'
                    } },
                    React.createElement(ProvenanceGraph, { input: input, currentAggregation: currentAggregation, addClusterToTrace: addClusterToTrace, selectSideBranch: selectSideBranch, dataset: dataset, onClusterClicked: (cluster) => {
                            setActiveTraceState(cluster);
                            setSelectedCluster([cluster], false);
                        } }),
                    React.createElement("div", { ref: itemRef, style: {
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '100px'
                        } },
                        React.createElement(material_1.Typography, { align: "center", variant: "subtitle2" }, "Summary"), (_a = stories.trace) === null || _a === void 0 ? void 0 :
                        _a.mainPath.map((cluster, index) => {
                            return React.createElement("div", { key: index, style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    margin: 8
                                }, onClick: () => {
                                    setActiveTraceState(cluster);
                                    setSelectedCluster([cluster], false);
                                } },
                                React.createElement(material_1.Typography, { noWrap: true, gutterBottom: true, style: { fontWeight: 'bold', textAlign: 'center', textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white', maxWidth: '250px' } }, Cluster_1.ACluster.getTextRepresentation(StoriesDuck_1.StoriesUtil.retrieveCluster(stories, cluster))),
                                React.createElement("div", { style: {
                                        border: currentAggregation.selectedClusters.includes(cluster) ? `1px solid ${mainColor}` : '1px solid rgba(0, 0, 0, 0.12)',
                                        borderRadius: 4,
                                        padding: '8px',
                                        display: 'flex',
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    } },
                                    React.createElement(Generic_1.GenericLegend, { type: dataset.type, vectors: StoriesDuck_1.StoriesUtil.retrieveCluster(stories, cluster).indices.map(i => dataset.vectors[i]), scale: 1, aggregate: true })));
                        })),
                    React.createElement("div", { style: {
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '100px',
                            position: 'relative'
                        } },
                        React.createElement(material_1.Typography, { align: "center", variant: "subtitle2" }, "Difference"),
                        input && React.createElement("div", { style: { height: input.firstDiv - ((dataset.type === DatasetType_1.DatasetType.Cohort_Analysis || dataset.type === DatasetType_1.DatasetType.None) ? 76 : 0) } }),
                        input && input.position.slice(0, input.position.length - 1).map((elem, index) => {
                            let edge = StoriesDuck_1.StoriesUtil.retreiveEdge(stories, elem.mainEdge);
                            return React.createElement("div", { key: index, className: "", style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    //top: input.position[index].y + input.position[index].height / 2 - ((dataset.type === DatasetType.Coral || dataset.type === DatasetType.None) ? 76 : 0),
                                    height: (input.position[index + 1].y + input.position[index + 1].height / 2) - (input.position[index].y + input.position[index].height / 2) - 16,
                                    margin: 8,
                                } },
                                React.createElement("div", { style: {
                                        border: '1px solid rgba(0, 0, 0, 0.12)',
                                        borderRadius: 4,
                                        padding: 8,
                                        maxHeight: '100%',
                                        overflowY: 'auto'
                                    } },
                                    React.createElement(GenericChanges_1.GenericChanges, { scale: 1, vectorsA: StoriesDuck_1.StoriesUtil.retrieveCluster(stories, edge.source).indices.map(i => dataset.vectors[i]), vectorsB: StoriesDuck_1.StoriesUtil.retrieveCluster(stories, edge.destination).indices.map(i => dataset.vectors[i]) })));
                        }))))));
});
