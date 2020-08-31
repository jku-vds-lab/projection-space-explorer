import React = require("react");
import { Card, CardHeader, IconButton, makeStyles } from "@material-ui/core";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux'

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


const mapStateToProps = state => ({
    projectionParams: state.projectionParams,
    worker: state.projectionWorker
})

/**
 * Projection card that allows to start/stop the projection and shows the current steps.
 */
export var ProjectionControlCard = connect(mapStateToProps)(({
    worker,
    input,
    onStep,
    onComputingChanged,
    projectionParams,
    onClose }) => {
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
            params: projectionParams
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
                    title={projectionParams.method == 0 ? 't-SNE' : 'UMAP'}
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
})