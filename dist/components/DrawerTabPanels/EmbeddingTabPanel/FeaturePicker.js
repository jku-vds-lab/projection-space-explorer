"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Dataset_1 = require("../../../model/Dataset");
const material_1 = require("@mui/material");
const react_redux_1 = require("react-redux");
const React = require("react");
const react_virtualized_1 = require("react-virtualized");
const material_2 = require("@mui/material");
const ProjectionColumnsDuck_1 = require("../../Ducks/ProjectionColumnsDuck");
const ProjectionOpenDuck_1 = require("../../Ducks/ProjectionOpenDuck");
const ProjectionParamsDuck_1 = require("../../Ducks/ProjectionParamsDuck");
const clsx_1 = require("clsx");
const clone = require("fast-clone");
const styles_1 = require("@mui/styles");
const styles = (theme) => ({
    flexContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    table: {
        // temporary right-to-left patch, waiting for
        // https://github.com/bvaughn/react-virtualized/issues/454
        '& .ReactVirtualized__Table__headerRow': {
            flip: false,
            paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
        },
    },
    tableRow: {
        cursor: 'pointer',
    },
    tableCell: {
        flex: 1,
    },
    noClick: {
        cursor: 'initial',
    },
});
class MuiVirtualizedTable extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.getRowClassName = ({ index }) => {
            const { classes, onRowClick } = this.props;
            return clsx_1.default(classes.tableRow, classes.flexContainer, {
                [classes.tableRowHover]: index !== -1 && onRowClick != null,
            });
        };
        this.cellRenderer = ({ cellData, columnIndex, rowIndex }) => {
            const { columns, classes, onRowClick } = this.props;
            const Col2 = ({ rowIndex }) => {
                let rowData = this.props.items[rowIndex];
                if ("groupLabel" in rowData) {
                    if (columnIndex == 0) {
                        return React.createElement("div", null, cellData === null || cellData === void 0 ? void 0 : cellData.toString());
                    }
                    else if (columnIndex == 1) {
                        return React.createElement(material_1.Checkbox, { color: "primary", disableRipple: true, indeterminate: rowData.checkedCount != 0 && rowData.checkedCount != rowData.items.length, checked: rowData.checkedCount == rowData.items.length, onClick: (event) => {
                                event.stopPropagation();
                                const target = event.target;
                                this.props.onCheckbox(columnIndex, rowIndex, event.shiftKey, target.checked);
                            } });
                    }
                    else if (columnIndex == 2) {
                        return React.createElement(material_1.Checkbox, { color: "primary", disableRipple: true, indeterminate: rowData.normalizedCount != 0 && rowData.normalizedCount != rowData.items.length, checked: rowData.normalizedCount == rowData.items.length, onClick: (event) => {
                                event.stopPropagation();
                                const target = event.target;
                                this.props.onCheckbox(columnIndex, rowIndex, event.shiftKey, target.checked);
                            } });
                    }
                    else {
                        return React.createElement("div", null, cellData === null || cellData === void 0 ? void 0 : cellData.toString());
                    }
                }
                else {
                    if (typeof cellData == "boolean") {
                        return React.createElement(material_1.Checkbox, { color: "primary", disableRipple: true, disabled: !rowData.checked && columnIndex == 2, checked: cellData, onClick: (event) => {
                                const target = event.target;
                                this.props.onCheckbox(columnIndex, rowIndex, event.shiftKey, target.checked);
                            } });
                    }
                    else {
                        if (cellData) {
                            if (columnIndex == 0) {
                                return React.createElement("div", null, cellData === null || cellData === void 0 ? void 0 : cellData.toString());
                            }
                            else {
                                return React.createElement("div", null, cellData.toString());
                            }
                        }
                        else {
                            return React.createElement("div", null);
                        }
                    }
                }
            };
            return (React.createElement(material_2.TableCell, { component: "div", className: clsx_1.default(classes.tableCell, classes.flexContainer, {
                    [classes.noClick]: onRowClick == null,
                }), variant: "body", align: (columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left' },
                React.createElement(Col2, { rowIndex: rowIndex })));
        };
        this.headerRenderer = ({ label, columnIndex }) => {
            const { headerHeight, columns, classes } = this.props;
            return (React.createElement(material_2.TableCell, { component: "div", className: clsx_1.default(classes.tableCell, classes.flexContainer, classes.noClick), variant: "head", style: { height: headerHeight }, align: columns[columnIndex].numeric || false ? 'right' : 'left' },
                React.createElement("span", null, label)));
        };
        this.rowHeight = (rowIndex) => {
            if (this.props.items && this.props.items[rowIndex.index].collapsed) {
                return 0;
            }
            else {
                return 48;
            }
        };
        this.rowRenderer = (props) => {
            if (this.props.items && this.props.items[props.index].collapsed) {
                return null;
            }
            if ("groupLabel" in props.rowData) {
                props.style.background = 'rgba(234, 234, 234, 1)';
                props.style.borderLeft = '2px solid black';
                return React.createElement("div", { style: { position: 'static' }, key: this.props.items[props.index].name, onClick: () => {
                        this.props.groupCollapse(props.index);
                    } }, react_virtualized_1.defaultTableRowRenderer(props));
            }
            else {
                return react_virtualized_1.defaultTableRowRenderer(props);
            }
        };
    }
    render() {
        const _a = this.props, { classes, columns, headerHeight } = _a, tableProps = __rest(_a, ["classes", "columns", "headerHeight"]);
        return (React.createElement(react_virtualized_1.AutoSizer, null, ({ height, width }) => (React.createElement(react_virtualized_1.Table, Object.assign({ ref: this.props.tableRef, height: height, width: width, rowHeight: this.rowHeight, gridStyle: {
                direction: 'inherit',
            }, headerHeight: headerHeight, className: classes.table }, tableProps, { rowClassName: this.getRowClassName, rowRenderer: this.rowRenderer }), columns.map((_a, index) => {
            var { dataKey } = _a, other = __rest(_a, ["dataKey"]);
            return (React.createElement(react_virtualized_1.Column, Object.assign({ key: dataKey, headerRenderer: (headerProps) => this.headerRenderer(Object.assign(Object.assign({}, headerProps), { columnIndex: index })), className: classes.flexContainer, cellRenderer: this.cellRenderer, dataKey: dataKey }, other)));
        })))));
    }
}
MuiVirtualizedTable.defaultProps = {
    headerHeight: 48
};
const VirtualizedTable = styles_1.withStyles(styles)(MuiVirtualizedTable);
const mapState = state => ({
    projectionColumns: state.projectionColumns,
    projectionOpen: state.projectionOpen,
    dataset: state.dataset
});
const mapDispatch = dispatch => ({
    setProjectionOpen: (projectionOpen) => dispatch(ProjectionOpenDuck_1.setProjectionOpenAction(projectionOpen)),
    setProjectionParams: (projectionParams) => dispatch(ProjectionParamsDuck_1.setProjectionParamsAction(projectionParams)),
    setProjectionColumns: value => dispatch(ProjectionColumnsDuck_1.setProjectionColumns(value))
});
const connector = react_redux_1.connect(mapState, mapDispatch);
function filterGroups(selection) {
    let label = 0;
    let groups = [{ groupLabel: label, name: Dataset_1.DefaultFeatureLabel, items: [], checkedCount: 0, normalizedCount: 0 }];
    selection.forEach((entry, i) => {
        let group = groups.find(e => e.name == entry.featureLabel);
        if (group) {
            let copy = clone(entry);
            copy.index = i;
            if (copy.checked) {
                group.checkedCount = group.checkedCount + 1;
            }
            if (copy.normalized) {
                group.normalizedCount = group.normalizedCount + 1;
            }
            group.items.push(copy);
        }
        else {
            label = label + 1;
            let copy = clone(entry);
            copy.index = i;
            let group = { groupLabel: label, name: entry.featureLabel, items: [copy], checkedCount: 0, normalizedCount: 0 };
            if (copy.checked) {
                group.checkedCount = group.checkedCount + 1;
            }
            if (copy.normalized) {
                group.normalizedCount = group.normalizedCount + 1;
            }
            groups.push(group);
        }
    });
    let items = [];
    groups.forEach(group => {
        items.push(group);
        group.items.forEach(i => items.push(i));
    });
    return [groups, items];
}
const FeaturePicker = connector(({ selection, setSelection }) => {
    const [last, setLast] = React.useState(0);
    const ref = React.useRef();
    let [groups, items] = filterGroups(selection);
    const setProjectionColumnsShift = (last, rowIndex) => {
        let copy = selection.slice(0);
        if (last <= rowIndex) {
            for (let i = last + 1; i <= rowIndex; i++) {
                copy[i].checked = !copy[i].checked;
            }
        }
        else {
            for (let i = rowIndex; i <= last - 1; i++) {
                copy[i].checked = !copy[i].checked;
            }
        }
        setSelection(copy);
    };
    const setProjectionColumnsEntry = (rowIndex, action) => {
        let copy = selection.slice(0);
        if ("checked" in action)
            copy[items[rowIndex].index].checked = action.checked;
        if ("normalized" in action)
            copy[items[rowIndex].index].normalized = action.normalized;
        setSelection(copy);
    };
    const setProjectionColumnGroup = (group, action) => {
        let copy = selection.slice(0);
        if ("checked" in action) {
            group.forEach(item => {
                copy[item.index].checked = action.checked;
            });
        }
        if ("normalized" in action) {
            group.forEach(item => {
                copy[item.index].normalized = action.normalized;
            });
        }
        setSelection(copy);
    };
    const setCollapse = (group, collapsed) => {
        let copy = selection.slice(0);
        group.forEach(item => {
            copy[item.index].collapsed = collapsed;
        });
        // @ts-ignore
        ref.current.recomputeRowHeights();
        setSelection(copy);
    };
    let comp = React.createElement("div", { style: {
            width: 840,
            height: 400
        } },
        React.createElement(VirtualizedTable, { tableRef: ref, onCheckbox: (columnIndex, rowIndex, shiftKey, value) => {
                if ("groupLabel" in items[rowIndex]) {
                    // Group item
                    if (columnIndex == 1) {
                        setProjectionColumnGroup(items[rowIndex].items, { checked: value });
                    }
                    if (columnIndex == 2) {
                        setProjectionColumnGroup(items[rowIndex].items, { normalized: value });
                    }
                }
                else {
                    // Single item
                    if (columnIndex == 1) {
                        if (shiftKey) {
                            setProjectionColumnsShift(last, rowIndex);
                        }
                        else {
                            setProjectionColumnsEntry(rowIndex, { checked: value });
                            setLast(rowIndex);
                        }
                    }
                    if (columnIndex == 2) {
                        setProjectionColumnsEntry(rowIndex, { normalized: value });
                    }
                }
            }, rowCount: items.length, rowGetter: ({ index }) => items[index], items: items, groups: groups, groupCollapse: (rowIndex) => {
                setCollapse(items[rowIndex].items, !selection[items[rowIndex].items[0].index].collapsed);
            }, columns: [
                {
                    width: 300,
                    label: "Name",
                    dataKey: "name"
                },
                {
                    width: 120,
                    label: "Project?",
                    dataKey: "checked",
                    numeric: false
                },
                {
                    width: 120,
                    label: "Normalize?",
                    dataKey: "normalized",
                    numeric: false
                },
                {
                    width: 250,
                    label: "Range",
                    dataKey: "range",
                    numeric: false
                }
            ] }));
    return comp;
});
exports.default = FeaturePicker;
