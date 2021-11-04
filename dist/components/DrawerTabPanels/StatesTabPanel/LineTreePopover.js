"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const styles_1 = require("@mui/styles");
const lab_1 = require("@mui/lab");
const material_1 = require("@mui/material");
const React = require("react");
const material_2 = require("@mui/material");
function MinusSquare(props) {
    return (React.createElement(material_1.SvgIcon, Object.assign({ fontSize: "inherit" }, props),
        React.createElement("path", { d: "M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" })));
}
function PlusSquare(props) {
    return (React.createElement(material_1.SvgIcon, Object.assign({ fontSize: "inherit" }, props),
        React.createElement("path", { d: "M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" })));
}
const styles = {
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
};
function LineSelectionTree_GetChecks(algorithms) {
    var ch = {};
    algorithms.forEach(algo => {
        algo.lines.forEach(line => {
            ch[line.line] = true;
        });
    });
    return ch;
}
exports.LineSelectionTree_GetChecks = LineSelectionTree_GetChecks;
function LineSelectionTree_GenAlgos(vectors) {
    if (vectors == null)
        return {};
    var algorithms = [];
    var t = [...new Set(vectors.map(vector => vector.algo))];
    t.forEach(algo => {
        var algoVectors = vectors.filter(vector => vector.algo == algo);
        var distinctLines = [...new Set(algoVectors.map(v => v.line))];
        algorithms.push({
            algo: algo,
            lines: distinctLines.map(line => {
                return {
                    line: line,
                    vectors: vectors.filter(v => v.line == line && v.algo == algo)
                };
            })
        });
    });
    return algorithms;
}
exports.LineSelectionTree_GenAlgos = LineSelectionTree_GenAlgos;
exports.LineSelectionTree = styles_1.withStyles(styles)(class extends React.Component {
    constructor(props) {
        super(props);
        var state = {
            expanded: []
        };
        this.state = state;
    }
    render() {
        if (this.props.algorithms == null)
            return React.createElement("div", null);
        return React.createElement(lab_1.TreeView, { defaultCollapseIcon: React.createElement(MinusSquare, null), defaultExpandIcon: React.createElement(PlusSquare, null), expanded: this.state.expanded, onNodeToggle: (event, nodes) => {
                this.setState({ expanded: nodes });
            } }, this.props.algorithms.map(algo => {
            return React.createElement(lab_1.TreeItem, { key: algo.algo, nodeId: algo.algo, label: algo.algo },
                React.createElement(material_2.Grid, { container: true, direction: "row" },
                    React.createElement(material_2.Grid, { item: true },
                        React.createElement(material_1.Link, { href: "#", onClick: () => {
                                this.props.onSelectAll(algo.algo, true);
                            } }, "Select all")),
                    React.createElement(material_2.Grid, { item: true },
                        React.createElement(material_1.Divider, { orientation: "vertical", style: { margin: '0px 8px' } })),
                    React.createElement(material_2.Grid, { item: true },
                        React.createElement(material_1.Link, { href: "#", onClick: () => {
                                this.props.onSelectAll(algo.algo, false);
                            } }, "Unselect all"))),
                algo.lines.map(line => {
                    return React.createElement(lab_1.TreeItem, { key: line.line, nodeId: line.line, label: React.createElement("div", null,
                            React.createElement(material_2.Checkbox, { color: "primary", disableRipple: true, style: { padding: '3px 9px', color: `${this.props.colorScale != null ? this.props.colorScale.map(algo.algo).hex : ''}` }, onClick: (e) => { e.stopPropagation(); }, onChange: (e, checked) => {
                                    this.props.onChange(line.line, checked);
                                }, checked: this.props.checkboxes[line.line] }),
                            React.createElement("div", { style: { display: 'inline', userSelect: 'none' } }, line.line)), onClick: (e) => {
                            this.props.onChange(line.line, !this.props.checkboxes[line.line]);
                        } });
                }));
        }));
    }
});
exports.LineTreePopover = ({ webGlView, dataset, colorScale }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [selectedLines, setSelectedLines] = React.useState(null);
    const [selectedLineAlgos, setSelectedLineAlgos] = React.useState(null);
    React.useEffect(() => {
        var algos = LineSelectionTree_GenAlgos(dataset.vectors);
        var selLines = LineSelectionTree_GetChecks(algos);
        setSelectedLines(selLines);
        setSelectedLineAlgos(algos);
    }, [dataset]);
    return React.createElement("div", null,
        React.createElement(material_2.Button, { "aria-describedby": id, variant: "outlined", onClick: handleClick }, "Advanced Coloring"),
        React.createElement(material_2.Popover, { id: id, open: open, anchorEl: anchorEl, onClose: handleClose, anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            }, transformOrigin: {
                vertical: 'top',
                horizontal: 'center',
            } },
            React.createElement(material_2.Grid, { style: { padding: '12px', width: 300, maxHeight: 600 }, container: true, alignItems: "stretch", direction: "column" },
                React.createElement(exports.LineSelectionTree, { onChange: (id, checked) => {
                        var ch = selectedLines;
                        ch[id] = checked;
                        setSelectedLines(Object.assign({}, ch));
                        webGlView.current.setLineFilter(ch);
                        webGlView.current.requestRender();
                    }, checkboxes: selectedLines, algorithms: selectedLineAlgos, colorScale: colorScale, onSelectAll: (algo, checked) => {
                        var ch = selectedLines;
                        Object.keys(ch).forEach(key => {
                            var e = selectedLineAlgos.find(e => e.algo == algo);
                            if (e.lines.find(e => e.line == key)) {
                                ch[key] = checked;
                            }
                        });
                        setSelectedLines(Object.assign({}, ch));
                        webGlView.current.setLineFilter(ch);
                        webGlView.current.requestRender();
                    } }))));
};
