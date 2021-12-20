import { Dataset, DefaultFeatureLabel } from "../../../model/Dataset";
import { Checkbox } from "@mui/material";
import { connect, ConnectedProps } from 'react-redux'
import React = require("react");
import { AutoSizer, Column, Table, defaultTableRowRenderer } from 'react-virtualized';
import { TableCell } from '@mui/material';
import { setProjectionColumns } from "../../Ducks/ProjectionColumnsDuck";
import { setProjectionOpenAction } from "../../Ducks/ProjectionOpenDuck";
import { setProjectionParamsAction } from "../../Ducks/ProjectionParamsDuck";
import clsx from 'clsx';
import clone = require('fast-clone')
import { withStyles } from "@mui/styles";




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


class MuiVirtualizedTable extends React.PureComponent<any> {
    static defaultProps = {
        headerHeight: 48
    };



    getRowClassName = ({ index }) => {
        const { classes, onRowClick } = this.props;

        return clsx(classes.tableRow, classes.flexContainer, {
            [classes.tableRowHover]: index !== -1 && onRowClick != null,
        });
    };

    cellRenderer = ({ cellData, columnIndex, rowIndex }) => {
        const { columns, classes, onRowClick } = this.props;

        const Col2 = ({ rowIndex }) => {
            let rowData = this.props.items[rowIndex]

            if ("groupLabel" in rowData) {
                if (columnIndex == 0) {
                    return <div>{cellData?.toString()}</div>
                } else if (columnIndex == 1) {
                    return <Checkbox
                        color="primary"
                        disableRipple
                        indeterminate={rowData.checkedCount != 0 && rowData.checkedCount != rowData.items.length}
                        checked={rowData.checkedCount == rowData.items.length}
                        onClick={(event) => {
                            event.stopPropagation()
                            const target: any = event.target
                            this.props.onCheckbox(columnIndex, rowIndex, event.shiftKey, target.checked)
                        }}
                    />
                } else if (columnIndex == 2) {
                    return <Checkbox
                        color="primary"
                        disableRipple
                        indeterminate={rowData.normalizedCount != 0 && rowData.normalizedCount != rowData.items.length}
                        checked={rowData.normalizedCount == rowData.items.length}
                        onClick={(event) => {
                            event.stopPropagation()
                            const target: any = event.target
                            this.props.onCheckbox(columnIndex, rowIndex, event.shiftKey, target.checked)
                        }}
                    />
                } else {
                    return <div>{cellData?.toString()}</div>
                }

            } else {
                if (typeof cellData == "boolean") {
                    return <Checkbox
                        color="primary"
                        disableRipple
                        disabled={!rowData.checked && columnIndex == 2}
                        checked={cellData}
                        onClick={(event) => {
                            const target: any = event.target
                            this.props.onCheckbox(columnIndex, rowIndex, event.shiftKey, target.checked)
                        }}
                    />
                } else {
                    if (cellData) {
                        if (columnIndex == 0) {
                            return <div>{cellData?.toString()}</div>
                        } else {
                            return <div>{cellData.toString()}</div>
                        }

                    } else {
                        return <div></div>
                    }

                }
            }
        }

        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, {
                    [classes.noClick]: onRowClick == null,
                })}
                variant="body"
                
                align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
            >
                <Col2 rowIndex={rowIndex}></Col2>
            </TableCell>
        )
    };

    headerRenderer = ({ label, columnIndex }) => {
        const { headerHeight, columns, classes } = this.props;

        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
                variant="head"
                style={{ height: headerHeight }}
                align={columns[columnIndex].numeric || false ? 'right' : 'left'}
            >
                <span>{label}</span>

            </TableCell>
        )
    }

    rowHeight = (rowIndex) => {
        if (this.props.items && this.props.items[rowIndex.index].collapsed) {
            return 0
        } else {
            return 48
        }
    }

    rowRenderer = (props) => {
        if (this.props.items && this.props.items[props.index].collapsed) {
            return null
        }
        if ("groupLabel" in props.rowData) {
            props.style.background = 'rgba(234, 234, 234, 1)'
            props.style.borderLeft = '2px solid black'
            return <div style={{position: 'static'}} key={this.props.items[props.index].name} onClick={() => {
                this.props.groupCollapse(props.index)
            }}>{defaultTableRowRenderer(props)}</div>
        } else {
            
            return defaultTableRowRenderer(props);
        }
    }

    render() {
        const { classes, columns, headerHeight, ...tableProps } = this.props;

        return (
            <AutoSizer>
                {({ height, width }) => (
                    <Table
                        ref={this.props.tableRef}
                        height={height}
                        width={width}
                        rowHeight={this.rowHeight}
                        gridStyle={{
                            direction: 'inherit',
                        }}
                        headerHeight={headerHeight}
                        className={classes.table}
                        {...tableProps}
                        rowClassName={this.getRowClassName}
                        rowRenderer={this.rowRenderer}
                    >
                        {columns.map(({ dataKey, ...other }, index) => {
                            return (
                                <Column
                                    key={dataKey}
                                    headerRenderer={(headerProps) =>
                                        this.headerRenderer({
                                            ...headerProps,
                                            columnIndex: index,
                                        })
                                    }
                                    className={classes.flexContainer}
                                    cellRenderer={this.cellRenderer}
                                    dataKey={dataKey}
                                    {...other}
                                />
                            );
                        })}
                    </Table>
                )}
            </AutoSizer>
        );
    }
}


const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);


const mapState = state => ({
    projectionColumns: state.projectionColumns,
    projectionOpen: state.projectionOpen,
    dataset: state.dataset
})

const mapDispatch = dispatch => ({
    setProjectionOpen: (projectionOpen) => dispatch(setProjectionOpenAction(projectionOpen)),
    setProjectionParams: (projectionParams) => dispatch(setProjectionParamsAction(projectionParams)),
    setProjectionColumns: value => dispatch(setProjectionColumns(value))
})



const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    selection,
    setSelection
}


function filterGroups(selection) {
    let label = 0
    let groups = [{ groupLabel: label, name: DefaultFeatureLabel, items: [], checkedCount: 0, normalizedCount: 0 }]



    selection.forEach((entry, i) => {
        let group = groups.find(e => e.name == entry.featureLabel)
        if (group) {
            let copy = clone(entry)
            copy.index = i
            if (copy.checked) {
                group.checkedCount = group.checkedCount + 1
            }
            if (copy.normalized) {
                group.normalizedCount = group.normalizedCount + 1
            }
            group.items.push(copy)
        } else {
            label = label + 1
            let copy = clone(entry)
            copy.index = i
            let group = { groupLabel: label, name: entry.featureLabel, items: [copy], checkedCount: 0, normalizedCount: 0 }
            if (copy.checked) {
                group.checkedCount = group.checkedCount + 1
            }
            if (copy.normalized) {
                group.normalizedCount = group.normalizedCount + 1
            }

            groups.push(group)
        }
    })

    let items = []
    groups.forEach(group => {
        items.push(group)
        group.items.forEach(i => items.push(i))
    })

    return [groups, items]
}

const FeaturePicker = connector(({ selection, setSelection }: Props) => {
    const [last, setLast] = React.useState(0)
    const ref = React.useRef()

    let [groups, items] = filterGroups(selection)

    const setProjectionColumnsShift = (last, rowIndex) => {
        let copy = selection.slice(0)

        if (last <= rowIndex) {
            for (let i = last + 1; i <= rowIndex; i++) {
                copy[i].checked = !copy[i].checked
            }
        } else {
            for (let i = rowIndex; i <= last - 1; i++) {
                copy[i].checked = !copy[i].checked
            }
        }

        setSelection(copy)
    }

    const setProjectionColumnsEntry = (rowIndex, action) => {
        let copy = selection.slice(0)

        if ("checked" in action)
            copy[items[rowIndex].index].checked = action.checked
        if ("normalized" in action)
            copy[items[rowIndex].index].normalized = action.normalized

        setSelection(copy)
    }

    const setProjectionColumnGroup = (group, action) => {
        let copy = selection.slice(0)

        if ("checked" in action) {
            group.forEach(item => {
                copy[item.index].checked = action.checked
            })
        }
        if ("normalized" in action) {
            group.forEach(item => {
                copy[item.index].normalized = action.normalized
            })
        }

        setSelection(copy)
    }

    const setCollapse = (group, collapsed) => {
        let copy = selection.slice(0)

        group.forEach(item => {
            copy[item.index].collapsed = collapsed
        })

        // @ts-ignore
        ref.current.recomputeRowHeights()

        setSelection(copy)
    }

    let comp = <div style={{
        width: 840,
        height: 400
    }}><VirtualizedTable
            tableRef={ref}
            onCheckbox={(columnIndex, rowIndex, shiftKey, value) => {
                if ("groupLabel" in items[rowIndex]) {
                    // Group item
                    if (columnIndex == 1) {
                        setProjectionColumnGroup(items[rowIndex].items, { checked: value })
                    }
                    if (columnIndex == 2) {
                        setProjectionColumnGroup(items[rowIndex].items, { normalized: value })
                    }
                } else {
                    // Single item
                    if (columnIndex == 1) {
                        if (shiftKey) {
                            setProjectionColumnsShift(last, rowIndex)
                        } else {
                            setProjectionColumnsEntry(rowIndex, { checked: value })
                            setLast(rowIndex)
                        }
                    }
                    if (columnIndex == 2) {
                        setProjectionColumnsEntry(rowIndex, { normalized: value })
                    }
                }
            }}
            rowCount={items.length}
            rowGetter={({ index }) => items[index]}
            items={items}
            groups={groups}
            groupCollapse={(rowIndex) => {
                setCollapse(items[rowIndex].items, !selection[items[rowIndex].items[0].index].collapsed)
            }}
            columns={[
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
            ]}
        />
    </div>

    return comp
})


export default FeaturePicker