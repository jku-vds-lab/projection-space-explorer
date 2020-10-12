import { Dataset } from "../../../util/datasetselector"
import { makeStyles, Modal, Box, Grid, Card, ListItem, Checkbox, ListItemIcon, ListItemText, Button, withStyles, Paper } from "@material-ui/core";
import { connect } from 'react-redux'
import React = require("react");
import { List } from 'react-virtualized';
import { ProjectionSettings } from "./ProjectionSettings/ProjectionSettings";
import { AutoSizer, Column, Table } from 'react-virtualized';
import TableCell from '@material-ui/core/TableCell';
import { setProjectionColumnsEntry, setProjectionColumnsShift } from "../../../Ducks/ProjectionColumnsDuck";
import { setProjectionOpenAction } from "../../../Ducks/ProjectionOpenDuck";
import { setProjectionParamsAction } from "../../../Ducks/ProjectionParamsDuck";
import clsx from 'clsx';
import { projection } from "vega";

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
    setProjectionColumnsEntry: (index, value) => dispatch(setProjectionColumnsEntry(index, value)),
    setProjectionColumnsShift: (last, index) => dispatch(setProjectionColumnsShift(last, index)),
    setProjectionOpen: (projectionOpen) => dispatch(setProjectionOpenAction(projectionOpen)),
    setProjectionParams: (projectionParams) => dispatch(setProjectionParamsAction(projectionParams))
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

// ---

const sample = [
    ['Frozen yoghurt', 159, 6.0, 24, 4.0],
    ['Ice cream sandwich', 237, 9.0, 37, 4.3],
    ['Eclair', 262, 16.0, 24, 6.0],
    ['Cupcake', 305, 3.7, 67, 4.3],
    ['Gingerbread', 356, 16.0, 49, 3.9],
];

function createData(id, dessert, calories, fat, carbs, protein) {
    return { id, dessert, calories, fat, carbs, protein };
}

const rows = [];

for (let i = 0; i < 200; i += 1) {
    const randomSelection = sample[Math.floor(Math.random() * sample.length)];
    rows.push(createData(i, ...randomSelection));
}

console.log(rows)


function TransferList({ projectionColumns, handleToggle, normalizeClick }) {
    const rowRenderer = function ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) {
        return <ListItem key={key} style={style} role="listitem">
            <ListItemIcon>
                <Checkbox
                    checked={projectionColumns[index].checked}
                    onClick={(event) => {
                        handleToggle(index, !projectionColumns[index].checked, event.shiftKey)
                    }}
                />
            </ListItemIcon>
            <ListItemText id={index} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} primary={`${projectionColumns[index].name}`} />
            <ListItemIcon>
                <Checkbox
                    checked={projectionColumns[index].normalized}
                    onChange={(event) => {
                        normalizeClick(index, event.target.checked)
                    }}
                />
            </ListItemIcon>
        </ListItem>
    }


    return <List
        width={500}
        height={500}
        rowCount={projectionColumns.length}
        rowHeight={42}
        rowRenderer={rowRenderer}


    />
}

export var TensorLoader = connect(mapStateToProps, mapDispatchToProps)(({
    onTensorInitiated,
    dataset,
    projectionOpen,
    setProjectionOpen,
    setProjectionColumnsEntry,
    setProjectionParams,
    projectionColumns,
    setProjectionColumnsShift }: TensorLoaderProps) => {
    if (dataset == null) return <div></div>

    const classes = useStylesTensorLoader()

    const [perplexity, setPerplexity] = React.useState(30)
    const [learningRate, setLearningRate] = React.useState(50)
    const [method, setMethod] = React.useState(0)
    const [nNeighbors, setNNeighbors] = React.useState(15)
    const [last, setLast] = React.useState(0)


    const handleClose = () => {
        setProjectionOpen(false);
    };

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
                                            {projectionColumns && <VirtualizedTable
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
                                                rowCount={projectionColumns.length}
                                                rowGetter={({ index }) => projectionColumns[index]}
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
                                    onTensorInitiated(e, projectionColumns.filter(e => e.checked))

                                }}>Start Projection</Button>
                        </Grid>

                    </Grid>
                </Box>
            </Card>
        </Modal>
    </div>
})

/**
 *                                         <TransferList
                                            projectionColumns={projectionColumns}
                                            handleToggle={(index, value, shiftKey) => {
                                                if (shiftKey) {
                                                    setProjectionColumnsShift(last, index)
                                                } else {
                                                    setProjectionColumnsEntry(index, { checked: value })
                                                    setLast(index)
                                                }
                                            }}
                                            normalizeClick={(index, value) => {
                                                setProjectionColumnsEntry(index, { normalized: value })
                                            }}
                                        />
 */