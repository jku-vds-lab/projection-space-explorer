import { Dataset } from "../../../util/datasetselector"
import { makeStyles, Modal, Box, Grid, Card, Checkbox, Button, withStyles, Paper } from "@material-ui/core";
import { connect, ConnectedProps } from 'react-redux'
import React = require("react");
import { AutoSizer, Column, Table } from 'react-virtualized';
import TableCell from '@material-ui/core/TableCell';
import { setProjectionColumns } from "../../../Ducks/ProjectionColumnsDuck";
import { setProjectionOpenAction } from "../../../Ducks/ProjectionOpenDuck";
import { setProjectionParamsAction } from "../../../Ducks/ProjectionParamsDuck";
import clsx from 'clsx';






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
    tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
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
        headerHeight: 48,
        rowHeight: 48,
    };

    getRowClassName = ({ index }) => {
        const { classes, onRowClick } = this.props;

        return clsx(classes.tableRow, classes.flexContainer, {
            [classes.tableRowHover]: index !== -1 && onRowClick != null,
        });
    };

    cellRenderer = ({ cellData, columnIndex, rowIndex }) => {

        const { columns, classes, rowHeight, onRowClick } = this.props;
        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, {
                    [classes.noClick]: onRowClick == null,
                })}
                variant="body"
                style={{ height: rowHeight }}
                align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
            >

                {typeof cellData == "boolean" ? <Checkbox
                    checked={cellData}
                    onClick={(event) => {
                        const target: any = event.target
                        this.props.onCheckbox(columnIndex, rowIndex, event.shiftKey, target.checked)
                    }}
                /> : <div>{cellData.toString()}</div>}

            </TableCell>
        );
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
        );
    };

    render() {
        const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
        return (
            <AutoSizer>
                {({ height, width }) => (
                    <Table
                        height={height}
                        width={width}
                        rowHeight={rowHeight}
                        gridStyle={{
                            direction: 'inherit',
                        }}
                        headerHeight={headerHeight}
                        className={classes.table}
                        {...tableProps}
                        rowClassName={this.getRowClassName}
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





type TensorLoaderProps = {
    onTensorInitiated: any
    dataset: Dataset
    setProjectionOpen: any
    projectionColumns: any
    projectionOpen: boolean
    setProjectionColumnsEntry: any
    setProjectionColumnsShift: any
    setProjectionParams: any
    setProjectionColumns: any
}

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



const FeaturePicker = connector(({ projectionColumns, selection, setSelection }: Props) => {
    const [last, setLast] = React.useState(0)

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
            copy[rowIndex].checked = action.checked
        if ("normalized" in action)
            copy[rowIndex].normalized = action.normalized

        setSelection(copy)
    }

    return <div style={{
        width: 840,
        height: 400
    }}><VirtualizedTable
        onCheckbox={(columnIndex, rowIndex, shiftKey, value) => {
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
        }}
        rowCount={selection.length}
        rowGetter={({ index }) => selection[index]}
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
                width: 300,
                label: "Range",
                dataKey: "range",
                numeric: false
            }
        ]}
    />
    </div>
})


export default FeaturePicker