import { Dataset } from "../../../util/datasetselector"
import { makeStyles, Modal, Box, Grid, Card, Checkbox, Button, withStyles, Paper } from "@material-ui/core";
import { connect } from 'react-redux'
import React = require("react");
import { ProjectionSettings } from "./ProjectionSettings/ProjectionSettings";
import { AutoSizer, Column, Table } from 'react-virtualized';
import TableCell from '@material-ui/core/TableCell';
import { setProjectionColumns } from "../../../Ducks/ProjectionColumnsDuck";
import { setProjectionOpenAction } from "../../../Ducks/ProjectionOpenDuck";
import { setProjectionParamsAction } from "../../../Ducks/ProjectionParamsDuck";
import clsx from 'clsx';

type TensorLoaderProps = {
    onTensorInitiated: any
    dataset: Dataset
    setProjectionOpen: any
    projectionColumns: any
    projectionOpen: boolean
    setProjectionColumnsEntry: any
    setProjectionColumnsShift: any
    setProjectionParams: any
    
}

const mapStateToProps = state => ({
    projectionColumns: state.projectionColumns,
    projectionOpen: state.projectionOpen,
    dataset: state.dataset
})

const mapDispatchToProps = dispatch => ({
    setProjectionOpen: (projectionOpen) => dispatch(setProjectionOpenAction(projectionOpen)),
    setProjectionParams: (projectionParams) => dispatch(setProjectionParamsAction(projectionParams)),
    setProjectionColumns: value => dispatch(setProjectionColumns(value))
})

const useStylesTensorLoader = makeStyles(theme => ({
    root: {
        position: 'absolute',
        right: '0px',
        top: '0px',
        margin: '16px'
    }
}));



const styles = (theme) => ({
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
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

class MuiVirtualizedTable extends React.PureComponent {
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
                        this.props.onCheckbox(columnIndex, rowIndex, event.shiftKey, event.target.checked)
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


export var TensorLoader = connect(mapStateToProps, mapDispatchToProps)(({
    onTensorInitiated,
    dataset,
    projectionOpen,
    setProjectionOpen,
    setProjectionParams,
    projectionColumns,
    setProjectionColumns }: TensorLoaderProps) => {
    if (dataset == null) return null



    const cloneColumns = () => {
        return projectionColumns.map(val => {
            return {
                name: val.name,
                normalized: val.normalized,
                checked: val.checked,
                range: val.range
            }
        })
    }



    const classes = useStylesTensorLoader()

    const [perplexity, setPerplexity] = React.useState(30)
    const [learningRate, setLearningRate] = React.useState(50)
    const [method, setMethod] = React.useState(0)
    const [nNeighbors, setNNeighbors] = React.useState(15)
    const [last, setLast] = React.useState(0)
    const [selection, setSelection] = React.useState(cloneColumns)
    
    React.useEffect(() => {
        if (projectionOpen) {
            setSelection(cloneColumns)
        }
    }, [projectionColumns, projectionOpen])

    const handleClose = () => {
        setProjectionOpen(false);
    };

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

    return <div className={classes.root}>
        <Modal
            open={projectionOpen}
            onClose={handleClose}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

            <Card style={{width:'80%'}}>
                <Box p={2}>
                    <Grid spacing={2} container direction="column" alignItems='stretch' justify='center'>
                        <Grid item>
                            <div>
                                <Grid spacing={2} container direction="column" alignItems='stretch' justify='center'>
                                    <Grid item>
                                        <Paper style={{ height: 400, width: "100%" }}>
                                            {selection && <VirtualizedTable
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
                                            />}
                                        </Paper>


                                    </Grid>
                                    <Grid item>
                                        <ProjectionSettings
                                            method={method}
                                            setMethod={setMethod}
                                            perplexity={perplexity}
                                            setPerplexity={setPerplexity}
                                            learningRate={learningRate}
                                            setLearningRate={setLearningRate}
                                            nNeighbors={nNeighbors}
                                            setNNeighbors={setNNeighbors}
                                        ></ProjectionSettings>
                                    </Grid>
                                </Grid>
                            </div>

                        </Grid>

                        <Grid item>
                            <Button
                                color='primary'
                                onClick={(e) => {
                                    setProjectionOpen(false)
                                    setProjectionParams({
                                        method: method,
                                        perplexity: perplexity,
                                        learningRate: learningRate,
                                        nNeighbors: nNeighbors
                                    })
                                    setProjectionColumns(selection)
                                    onTensorInitiated(e, selection.filter(e => e.checked))

                                }}>Start Projection</Button>
                        </Grid>

                    </Grid>
                </Box>
            </Card>
        </Modal>
    </div>
})