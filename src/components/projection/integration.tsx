/**
 * In this file are components used for projecting data on-the-fly.
 * The file 'worker_projection.js' contains a web worker which computes t-SNE, UMAP usw in
 * a seperate thread to make the UI not lag during projection steps.
 */




import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react'


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













