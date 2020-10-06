import { Dataset } from "../../../util/datasetselector"
import { makeStyles, Modal, Box, Grid, Card, ListItem, Checkbox, ListItemIcon, ListItemText, Button } from "@material-ui/core";
import { connect } from 'react-redux'
import { setProjectionOpenAction } from "../../../Ducks/ProjectionOpenDuck";
import { setProjectionParamsAction } from "../../../Ducks/ProjectionParamsDuck";
import React = require("react");
import { List } from 'react-virtualized';
import { ProjectionSettings } from "./ProjectionSettings/ProjectionSettings";
import { setProjectionColumnsEntry, setProjectionColumnsShift } from "../../../Ducks/ProjectionColumnsDuck";

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

            <Card>
                <Box p={2}>
                    <Grid spacing={2} container direction="column" alignItems='center' justify='center'>
                        <Grid item>
                            <div>
                                <Grid spacing={2} container direction="column" alignItems='stretch' justify='center'>
                                    <Grid item>
                                        <TransferList
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
