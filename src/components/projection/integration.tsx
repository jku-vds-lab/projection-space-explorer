/**
 * In this file are components used for projecting data on-the-fly.
 * The file 'worker_projection.js' contains a web worker which computes t-SNE, UMAP usw in
 * a seperate thread to make the UI not lag during projection steps.
 */




import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { Modal, Typography, IconButton, Box, TextField } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert'
import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react'
import { List } from 'react-virtualized';
import { connect } from 'react-redux'
import { Dataset } from '../util/datasetselector';
import { setProjectionColumnsEntry, setProjectionColumnsShift } from '../Actions/Actions';

const useStyles = makeStyles(theme => ({
    root: {
        margin: 'auto',
        borderRadius: 2
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        width: 200,
        height: 300,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
}));


function not(a, b) {
    return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter(value => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

/**export var TransferList = ({ left, right, setLeft, setRight }) => {
    if (right == null) return <div></div>
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);



    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = items => intersection(checked, items).length;

    const handleToggleAll = items => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (title, items) => (
        <Card>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{ 'aria-label': 'all items selected' }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List className={classes.list} dense component="div" role="list">
                {items.map(value => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value}`} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <Grid container justify="center" alignItems="center" className={classes.root}>
            <Grid item>{customList('Available Columns', left)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        style={{ margin: '4px 8px' }}
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        style={{ margin: '4px 8px' }}
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item>{customList('Selected Columns', right)}</Grid>
        </Grid>
    );
}**/







const useStylesTensorLoader = makeStyles(theme => ({
    root: {
        position: 'absolute',
        right: '0px',
        top: '0px',
        margin: '16px'
    }
}));






function TransferList({ projectionColumns, handleToggle }) {
    const rowRenderer = function ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) {
        return <ListItem key={key} style={style} role="listitem" button onClick={(event) => {
            handleToggle(index, !projectionColumns[index].checked, event.shiftKey)
        }}>
            <ListItemIcon>
                <Checkbox
                    checked={projectionColumns[index].checked}
                    tabIndex={-1}
                    disableRipple
                />
            </ListItemIcon>
            <ListItemText id={index} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} primary={`${projectionColumns[index].name}`} />
        </ListItem>
    }


    return <List
        width={500}
        height={500}
        rowCount={projectionColumns.length}
        rowHeight={25}
        rowRenderer={rowRenderer}
    />
}

type TensorLoaderProps = {
    onTensorInitiated: any
    dataset: Dataset
    open: boolean
    setOpen: any
    projectionColumns: any
    setProjectionColumnsEntry: any
}

const mapStateToProps = state => ({
    projectionColumns: state.projectionColumns
})

const mapDispatchToProps = dispatch => ({
    setProjectionColumnsEntry: (index, value) => dispatch(setProjectionColumnsEntry(index, value)),
    setProjectionColumnsShift: (last, index) => dispatch(setProjectionColumnsShift(last, index))
})


export var TensorLoader = connect(mapStateToProps, mapDispatchToProps)(({ onTensorInitiated, dataset, open, setOpen, setProjectionColumnsEntry, projectionColumns, setProjectionColumnsShift }: TensorLoaderProps) => {
    if (dataset == null) return <div></div>

    const classes = useStylesTensorLoader()

    const [perplexity, setPerplexity] = React.useState(30)
    const [learningRate, setLearningRate] = React.useState(50)
    const [method, setMethod] = React.useState(0)
    const [nNeighbors, setNNeighbors] = React.useState(15)
    const [last, setLast] = React.useState(0)


    const handleClose = () => {
        setOpen(false);
    };


    return <div className={classes.root}>
        <Modal
            open={open}
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
                                                    setProjectionColumnsEntry(index, value)
                                                    setLast(index)
                                                }
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

                                    setOpen(false)
                                    onTensorInitiated(e, projectionColumns.filter(e => e.checked).map(e => e.name), {
                                        method: method,
                                        perplexity: perplexity,
                                        learningRate: learningRate,
                                        nNeighbors: nNeighbors
                                    })

                                }}>Start Projection</Button>
                        </Grid>

                    </Grid>
                </Box>
            </Card>
        </Modal>
    </div>
})


















/**
 * Styles for the projection card that allows to stop/resume projection steps.
 */
const useStylesMedia = makeStyles(theme => ({
    root: {
        display: 'flex',
        margin: '8px 0',
        pointerEvents: 'auto'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        width: '100%'
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));


/**
 * Projection card that allows to start/stop the projection and shows the current steps.
 */
export var MediaControlCard = ({ worker, input, onStep, onComputingChanged, params, onClose }) => {
    if (input == null || worker == null) return <div></div>

    const classes = useStylesMedia();


    const [step, setStep] = React.useState(0)
    const [computing, setComputing] = React.useState(true)

    React.useEffect(() => {
        if (step < 1000 && computing && worker != null) {
            worker.postMessage(null)
        }
    }, [step, computing])


    React.useEffect(() => {
        var counter = step
        worker.addEventListener('message', (e) => {
            var Y = e.data

            counter = counter + 1
            setStep(counter)
            onStep(Y)
        }, false);

        worker.postMessage({
            input: input,
            params: params
        })
    }, [worker])

    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardHeader
                    avatar={<div></div>
                    }
                    action={
                        <IconButton aria-label="settings" onClick={(e) => {
                            onClose()
                        }}>
                            <CloseIcon />
                        </IconButton>
                    }
                    title={params.method == 0 ? 't-SNE' : 'UMAP'}
                    subheader={`${step}/1000`}
                />
                <div className={classes.controls}>

                    <IconButton aria-label="play/pause" onClick={(e) => {
                        var newVal = !computing
                        setComputing(newVal)
                        onComputingChanged(null, newVal)
                    }}>
                        {computing ? <StopIcon className={classes.playIcon} /> :
                            <PlayArrowIcon className={classes.playIcon}></PlayArrowIcon>}
                    </IconButton>

                </div>
            </div>
        </Card>
    );
}

















/**
 * Styles for the projection card that allows to stop/resume projection steps.
 */
const useStylesCluster = makeStyles(theme => ({
    root: {
        display: 'flex',
        margin: '8px 0',
        pointerEvents: 'auto'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        width: '100%'
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));




export var ClusterWindow = ({ worker, onClose }) => {
    if (worker == null) {
        return <div></div>
    }

    const classes = useStylesCluster();

    return <Card className={classes.root}>
        <div className={classes.details}>
            <CardHeader
                avatar={<div></div>
                }
                action={
                    <IconButton onClick={(e) => {
                        onClose()
                    }}>
                        <CloseIcon />
                    </IconButton>
                }
                title={'Cluster Progress'}
                subheader={`hdbscan*`}
            />
            <div className={classes.controls}>
                <CircularProgress />
            </div>
        </div>
    </Card>
}













const useStylesProjectionSettings = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 224,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    panel: {
    }
}));


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}


/**
 * Radio group with projection settings based on projection method.
 */
var ProjectionSettings = ({ method, setMethod,
    learningRate, perplexity,
    setLearningRate, setPerplexity,
    nNeighbors, setNNeighbors }) => {
    const classes = useStylesProjectionSettings();

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={method}
                onChange={(event, newValue) => setMethod(newValue)}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
                <Tab label="t-SNE" {...a11yProps(0)} />
                <Tab label="UMAP" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={method} index={0} className={classes.panel}>
                <div>

                    <TextField
                        id="standard-number"
                        label="Perplexity"
                        type="number"
                        value={perplexity}
                        onChange={(e) => setPerplexity(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                </div>
                <div>

                    <TextField
                        id="standard-number"
                        label="Learning Rate"
                        type="number"
                        value={learningRate}
                        onChange={(e) => setLearningRate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                </div>
            </TabPanel>
            <TabPanel value={method} index={1} className={classes.panel}>
                <TextField
                    id="standard-number"
                    label="n Neighbors"
                    type="number"
                    value={nNeighbors}
                    onChange={(e) => setNNeighbors(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </TabPanel>
        </div>
    );
}