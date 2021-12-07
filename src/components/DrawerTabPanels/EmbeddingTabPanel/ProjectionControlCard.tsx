import React = require("react");
import { Card, CardHeader, IconButton } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import CloseIcon from '@mui/icons-material/Close';
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from "../../Store/Store";
import SettingsBackupRestoreSharp from '@mui/icons-material/SettingsBackupRestoreSharp';
import { makeStyles } from "@mui/styles";

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
        //paddingLeft: theme.spacing(1),
        //paddingBottom: theme.spacing(1),
        width: '100%'
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));


const mapStateToProps = (state: RootState) => ({
    projectionParams: state.projectionParams,
    worker: state.projectionWorker
})

const mapDispatch = dispatch => ({})

const connector = connect(mapStateToProps, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    onClose: any
    onComputingChanged: any
    controller: any
}

/**
 * Projection card that allows to start/stop the projection and shows the current steps.
 */
export var ProjectionControlCard = connector(({
    onComputingChanged,
    projectionParams,
    controller,
    onClose }: Props) => {
    if (controller == null) return null

    const classes = useStylesMedia();


    const [step, setStep] = React.useState(0)
    const ref = React.useRef(step)

    if(step == 0){
        console.time('time elapsed to project the file ' + localStorage.getItem("unique_filename"))
    }
    if(step / projectionParams.iterations >= 1){
        console.timeEnd('time elapsed to project the file ' + localStorage.getItem("unique_filename"))
    }

    const [computing, setComputing] = React.useState(true)

    controller.notifier = () => {
        updateState(ref.current + 1)
    }

    React.useEffect(() => {
        if (step < projectionParams.iterations && computing) {
            controller.step()
        }
    }, [step, computing])

    function updateState(newState) {
        ref.current = newState;
        setStep(newState);
    }

    const titles = {
        forceatlas2: 'ForceAtlas2',
        umap: 'UMAP',
        tsne: 't-SNE'
    }

    const genlabel = (step) => {
        if (step == 0) {
            return <div>Initializing Projection ...</div>
        }
        const percent = Math.min((step / projectionParams.iterations) * 100, 100).toFixed(1)
        return <div><div>{`${Math.min(step, projectionParams.iterations)}/${projectionParams.iterations}`}</div><div>{`${percent}%`}</div></div>
    }

    
    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardHeader
                    avatar={<div></div>
                    }
                    action={
                        <IconButton aria-label="settings" onClick={(e) => {
                            console.timeEnd('time elapsed to project the file ' + localStorage.getItem("unique_filename"))
                            onClose()
                        }}>
                            <CloseIcon />
                        </IconButton>
                    }
                    title={titles[projectionParams.method]}
                    subheader={genlabel(step)}
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