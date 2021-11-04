"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const React = require("react");
const material_1 = require("@mui/material");
const HighlightedSequenceDuck_1 = require("../Ducks/HighlightedSequenceDuck");
const styles_1 = require("@mui/styles");
const Close_1 = require("@mui/icons-material/Close");
const SkipPrevious_1 = require("@mui/icons-material/SkipPrevious");
const PlayArrow_1 = require("@mui/icons-material/PlayArrow");
const SkipNext_1 = require("@mui/icons-material/SkipNext");
const Stop_1 = require("@mui/icons-material/Stop");
const ActiveLineDuck_1 = require("../Ducks/ActiveLineDuck");
const Generic_1 = require("../legends/Generic");
const GenericChanges_1 = require("../legends/GenericChanges");
const DatasetType_1 = require("../../model/DatasetType");
const resize_observer_1 = require("resize-observer");
const AggregationDuck_1 = require("../Ducks/AggregationDuck");
const mainColor = '#007dad';
const useStyles = styles_1.makeStyles((theme) => ({
    paper: {
        padding: '6px 16px',
    },
    primaryTail: {
    // backgroundColor: theme.palette.primary.main,
    },
}));
/**
 * The StateSequenceDrawer is the UI element that is shown when one line is selected by the line selection tool. In this case
 * the user wants to navigate the sequence of one line only.
 */
const StateSequenceDrawer = ({ activeLine, setHighlightedSequence, dataset, setActiveLine, setCurrentAggregation }) => {
    if (activeLine == null) {
        return React.createElement("div", null);
    }
    const vectors = dataset.segments.find(seg => seg.lineKey == activeLine).vectors;
    const stateSize = 12;
    const midX = 32;
    const grayColor = '#808080';
    const classes = useStyles();
    const [selected, setSelected] = React.useState(0);
    const [playing, setPlaying] = React.useState(null);
    const itemRef = React.useRef();
    const [dirtyFlag, setDirtyFlag] = React.useState(0);
    const [input, setInput] = React.useState(null);
    React.useEffect(() => {
        setSelected(0);
        setHighlightedSequence({
            previous: null,
            current: vectors[0],
            next: vectors[1]
        });
        setCurrentAggregation([vectors[0].__meta__.meshIndex]);
        setPlaying(null);
    }, [activeLine]);
    React.useEffect(() => {
        const observer = new resize_observer_1.ResizeObserver(() => {
            setDirtyFlag(Math.random());
        });
        observer.observe(itemRef.current);
        return () => {
            if (observer && itemRef.current) {
                observer.unobserve(itemRef.current);
            }
        };
    }, []);
    React.useEffect(() => {
        const current = itemRef.current;
        //@ts-ignore
        if (current && current.children.length > 0) {
            const state = [];
            let elementHeight = 0;
            let firstDiv = 0;
            //@ts-ignore
            for (var i = 1; i < current.children.length; i++) {
                //@ts-ignore
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
                    textY: child.firstChild.offsetTop
                });
            }
            setInput({
                position: state,
                elementHeight: elementHeight,
                firstDiv: firstDiv
            });
        }
    }, [dirtyFlag]);
    return React.createElement(material_1.Card, { className: "ClusterOverviewParent", variant: "outlined" },
        React.createElement("div", { style: {
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            } },
            React.createElement(material_1.CardHeader, { style: { paddingBottom: 0 }, action: React.createElement(material_1.IconButton, { "aria-label": "close", onClick: () => {
                        setHighlightedSequence(null);
                        setActiveLine(null);
                    } },
                    React.createElement(Close_1.default, null)), title: `Line ${activeLine}` }),
            React.createElement("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                } },
                React.createElement(material_1.IconButton, { "aria-label": "previous", onClick: () => {
                        if (selected > 0) {
                            setHighlightedSequence({
                                previous: vectors[selected - 2],
                                current: vectors[selected - 1],
                                next: vectors[selected]
                            });
                            setCurrentAggregation([vectors[selected - 1].__meta__.meshIndex]);
                            let myElement = document.getElementById(`ssdChild${selected - 2}`);
                            if (myElement) {
                                let topPos = myElement.offsetTop;
                                document.getElementById('ssdParent').scrollTop = topPos;
                            }
                            else {
                                myElement = document.getElementById(`ssdChild${selected - 1}`);
                                let topPos = myElement.offsetTop;
                                document.getElementById('ssdParent').scrollTop = topPos;
                            }
                            setSelected(selected - 1);
                        }
                        else {
                            setHighlightedSequence({
                                previous: undefined,
                                current: vectors[vectors.length - 2],
                                next: vectors[vectors.length - 1]
                            });
                            setCurrentAggregation([vectors[vectors.length - 2].__meta__.meshIndex]);
                            let myElement = document.getElementById(`ssdChild${vectors.length - 3}`);
                            let topPos = myElement.offsetTop;
                            document.getElementById('ssdParent').scrollTop = topPos;
                            setSelected(vectors.length - 1);
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
                                document.getElementById('nextBtn').click();
                            }, 300);
                            setPlaying(interval);
                        }
                    } }, playing ? React.createElement(Stop_1.default, null) : React.createElement(PlayArrow_1.default, null)),
                React.createElement(material_1.IconButton, { "aria-label": "next", id: "nextBtn", onClick: () => {
                        if (selected + 1 < vectors.length) {
                            setHighlightedSequence({
                                previous: vectors[selected],
                                current: vectors[selected + 1],
                                next: vectors[selected + 2]
                            });
                            setCurrentAggregation([vectors[selected + 1].__meta__.meshIndex]);
                            let myElement = document.getElementById(`ssdChild${selected}`);
                            let topPos = myElement.offsetTop;
                            document.getElementById('ssdParent').scrollTop = topPos;
                            setSelected(selected + 1);
                        }
                        else {
                            setHighlightedSequence({
                                previous: vectors[0 - 1],
                                current: vectors[0],
                                next: vectors[0 + 1]
                            });
                            setCurrentAggregation([vectors[0].__meta__.meshIndex]);
                            let myElement = document.getElementById(`ssdChild${0}`);
                            let topPos = myElement.offsetTop;
                            document.getElementById('ssdParent').scrollTop = topPos;
                            setSelected(0);
                        }
                    } },
                    React.createElement(SkipNext_1.default, null))),
            React.createElement("div", { id: 'ssdParent', style: { overflowY: 'auto' } },
                React.createElement("div", { style: {
                        display: 'flex',
                        flexDirection: 'row',
                        padding: '8px'
                    } },
                    React.createElement("svg", { style: {
                            height: '100%',
                            maxWidth: '120px',
                            minHeight: input && input.position && input.position.length > 0 ? input.position[input.position.length - 1].y + 100 : 200,
                            width: '64px'
                        } },
                        input && input.position.map((p, i) => {
                            if (i != input.position.length - 1) {
                                let p1 = p;
                                let p2 = input.position[i + 1];
                                return React.createElement("line", { key: `${p.x}${p.y}`, x1: midX, y1: p1.y, x2: midX, y2: p2.y, stroke: mainColor, strokeWidth: "2" });
                            }
                        }),
                        input && input.position.map((p, index) => {
                            return React.createElement("g", { key: `${p.x}${p.y}` },
                                selected === index && React.createElement("circle", { cx: midX, cy: p.y, r: stateSize, fill: 'transparent', stroke: mainColor, strokeWidth: "2" }),
                                React.createElement("circle", { cx: midX, cy: p.y, r: stateSize / 2, fill: selected === index ? mainColor : grayColor, transform: `rotate(45,${midX},${p.y})`, onClick: () => { } }));
                        })),
                    React.createElement("div", { ref: itemRef },
                        React.createElement(material_1.Typography, { align: "center", variant: "subtitle2" }, "State"),
                        vectors.map((vector, index) => {
                            return React.createElement("div", { key: index, style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    margin: 8
                                }, onClick: () => {
                                    setHighlightedSequence({
                                        previous: vectors[index - 1],
                                        current: vector,
                                        next: vectors[index + 1]
                                    });
                                    setCurrentAggregation([vector.__meta__.meshIndex]);
                                    setSelected(index);
                                } },
                                React.createElement(material_1.Typography, { noWrap: true, gutterBottom: true, style: { fontWeight: 'bold', textAlign: 'center', textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white', maxWidth: '250px' } }, `Point ${index}`),
                                React.createElement("div", { className: "ClusterItem", id: `ssdChild${index}`, style: {
                                        border: selected == index ? `1px solid ${mainColor}` : '1px solid rgba(0, 0, 0, 0.12)',
                                        borderRadius: 4,
                                        padding: '8px',
                                        display: 'flex'
                                    } },
                                    React.createElement(Generic_1.GenericLegend, { aggregate: false, type: dataset.type, vectors: [vector], scale: 1 })));
                        })),
                    React.createElement("div", { style: {
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '100px',
                            position: 'relative'
                        } },
                        React.createElement(material_1.Typography, { align: "center", variant: "subtitle2" }, "Change"),
                        input && React.createElement("div", { style: { height: input.firstDiv - ((dataset.type === DatasetType_1.DatasetType.Cohort_Analysis || dataset.type === DatasetType_1.DatasetType.None) ? 76 : 0) } }),
                        input && vectors.slice(0, vectors.length - 1).map((vector, index) => {
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
                                    React.createElement(GenericChanges_1.GenericChanges, { scale: 1, vectorsA: [vectors[index]], vectorsB: [vectors[index + 1]] })));
                        }))))));
};
const mapStateToProps = state => ({
    activeLine: state.activeLine,
    currentTool: state.currentTool,
    highlightedSequence: state.highlightedSequence,
    dataset: state.dataset,
    stories: state.stories
});
const mapDispatchToProps = dispatch => ({
    setHighlightedSequence: highlightedSequence => dispatch(HighlightedSequenceDuck_1.setHighlightedSequenceAction(highlightedSequence)),
    setActiveLine: activeLine => dispatch(ActiveLineDuck_1.setActiveLine(activeLine)),
    // setCurrentAggregation: (currentAggregation, clusters) => dispatch(setAggregationAction(currentAggregation, clusters))
    setCurrentAggregation: (currentAggregation) => dispatch(AggregationDuck_1.selectVectors(currentAggregation))
});
exports.StateSequenceDrawerRedux = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(StateSequenceDrawer);
