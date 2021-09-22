import { connect, ConnectedProps } from 'react-redux'
import React = require('react')
import { FlexParent } from '../../Utility/FlexParent'
import { Avatar, Box, Button, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core'
import { ProjectionControlCard } from './ProjectionControlCard/ProjectionControlCard'
import { setProjectionOpenAction } from "../../Ducks/ProjectionOpenDuck"
import { setProjectionWorkerAction } from "../../Ducks/ProjectionWorkerDuck"
import { Dataset } from "../../Utility/Data/Dataset"
import { GenericSettings } from './GenericSettings/GenericSettings'
import { RootState } from '../../Store/Store'
import { setProjectionParamsAction } from '../../Ducks/ProjectionParamsDuck'
import { setProjectionColumns } from '../../Ducks/ProjectionColumnsDuck'
import { TSNEEmbeddingController } from './EmbeddingController/TSNEEmbeddingController'
import { UMAPEmbeddingController } from './EmbeddingController/UMAPEmbeddingController'
import { ClusterTrailSettings } from './ClusterTrailSettings/ClusterTrailSettings'
import { setTrailVisibility } from '../../Ducks/TrailSettingsDuck'
import { ForceAtlas2EmbeddingController } from './EmbeddingController/ForceAtlas2EmbeddingController'
import { Embedding } from '../../Utility/Data/Embedding'
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import { addProjectionAction, deleteProjectionAction } from '../../Ducks/ProjectionsDuck'

import * as frontend_utils from '../../../utils/frontend-connect';

const mapStateToProps = (state: RootState) => ({
    currentAggregation: state.currentAggregation,
    stories: state.stories,
    projectionWorker: state.projectionWorker,
    projectionOpen: state.projectionOpen,
    dataset: state.dataset,
    projectionParams: state.projectionParams,
    projections: state.projections
})

const mapDispatchToProps = dispatch => ({
    setProjectionOpen: value => dispatch(setProjectionOpenAction(value)),
    setProjectionWorker: value => dispatch(setProjectionWorkerAction(value)),
    setProjectionParams: value => dispatch(setProjectionParamsAction(value)),
    setProjectionColumns: value => dispatch(setProjectionColumns(value)),
    setTrailVisibility: visibility => dispatch(setTrailVisibility(visibility)),
    addProjection: embedding => dispatch(addProjectionAction(embedding)),
    deleteProjection: projection => dispatch(deleteProjectionAction(projection))
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    projectionWorker?: Worker
    projectionOpen?: boolean
    setProjectionOpen?: any
    setProjectionWorker?: any
    dataset?: Dataset
    webGLView?: any
}


export const EmbeddingTabPanel = connector((props: Props) => {
    const [open, setOpen] = React.useState(false)
    const [domainSettings, setDomainSettings] = React.useState('')

    const [controller, setController] = React.useState(null)

    React.useEffect(()=>{
        if (controller) {
            controller.terminate()
        }
        setController(null)
        props.setTrailVisibility(false)
    }, [props.dataset]);


    const onSaveProjectionClick = (name) => {
        props.addProjection(new Embedding(props.dataset.vectors, "Created " + name))
    }

    const onProjectionClick = (projection: Embedding) => {
        props.webGLView.current.loadProjection(projection)
    }

    const onDeleteProjectionClick = (projection: Embedding) => {
        props.deleteProjection(projection)
    }



    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box paddingLeft={2} paddingTop={2}>
            <Typography variant="subtitle2" gutterBottom>{'Projection Methods'}</Typography>
        </Box>

        <Box paddingLeft={2} paddingRight={2}>
            <Grid container direction="column" spacing={1}>
                <Grid item>
                    <Button
                        style={{
                            width: '100%'
                        }}
                        variant="outlined"
                        onClick={() => {
                            setDomainSettings('umap')
                            setOpen(true)
                        }}>{'UMAP'}</Button>
                </Grid>
                {
                !frontend_utils.CHEM_PROJECT &&
                <Grid item>
                    <Button
                        style={{
                            width: '100%'
                        }}
                        variant="outlined"
                        onClick={() => {
                            setDomainSettings('tsne')
                            setOpen(true)
                        }}>{'t-SNE'}</Button>
                </Grid>
                }

                {
                !frontend_utils.CHEM_PROJECT && 
                <Grid item>
                    <Button
                        style={{
                            width: '100%'
                        }}
                        variant="outlined"
                        onClick={() => {
                            setDomainSettings('forceatlas2')
                            setOpen(true)
                        }}>{'ForceAtlas2'}</Button>
                </Grid>
                }
            </Grid>
        </Box>

        <Box p={1}>
            <ProjectionControlCard
                controller={controller}
                onClose={() => {
                    if (controller) {
                        controller.terminate()
                    }
                    setController(null)
                    props.setTrailVisibility(false)
                }}
                onComputingChanged={(e, newVal) => {
                }} />
        </Box>


        <GenericSettings
            projectionParams={props.projectionParams}
            domainSettings={domainSettings}
            open={open} onClose={() => setOpen(false)}
            onStart={(params, selection) => {
                const checked_sel = selection.filter(s => s.checked)
                if(checked_sel.length <= 0){
                    alert("Select at least one feature.")
                    return;
                }

                setOpen(false)
                props.setProjectionColumns(selection)
                props.setProjectionParams(params)

                switch (domainSettings) {
                    case 'tsne': {
                        let controller = new TSNEEmbeddingController()
                        controller.init(props.dataset, selection, params)
                        controller.stepper = (Y) => {
                            props.dataset.vectors.forEach((vector, i) => {
                                vector.x = Y[i][0]
                                vector.y = Y[i][1]
                            })
                            props.webGLView.current.updateXY()
                            props.webGLView.current.repositionClusters()
                        }

                        setController(controller)
                        break;
                    }

                    case 'umap': {
                        let controller = new UMAPEmbeddingController()
                        let samples = params.useSelection ? props.currentAggregation.aggregation : props.dataset.vectors

                        controller.init(props.dataset, selection, params, params.useSelection ? samples : undefined)
                        controller.stepper = (Y) => {
                            let source = controller.boundsY(Y)
                            let target = controller.targetBounds



                            samples.forEach((sample, i) => {
                                if (controller.targetBounds) {
                                    sample.x = target.x + ((Y[i][0] - source.x) / source.width) * target.width
                                    sample.y = target.y + ((Y[i][1] - source.y) / source.height) * target.height
                                } else {
                                    sample.x = Y[i][0]
                                    sample.y = Y[i][1]
                                }

                            })


                            props.webGLView.current.updateXY()
                            props.webGLView.current.repositionClusters()
                        }

                        setController(controller)
                        break;
                    }
                    case 'forceatlas2': {
                        let controller = new ForceAtlas2EmbeddingController()
                        controller.init(props.dataset, selection, params)

                        controller.stepper = (Y) => {
                            props.dataset.vectors.forEach((sample, i) => {
                                let idx = controller.nodes[sample.__meta__.duplicateOf].__meta__.meshIndex
                                sample.x = Y[idx].x
                                sample.y = Y[idx].y
                            })
                            props.webGLView.current.updateXY()
                        }

                        setController(controller)
                        break;
                    }

                }
            }}
        ></GenericSettings>

        <Box paddingLeft={2} paddingTop={2}>
            <Typography variant="subtitle2" gutterBottom>{'Projection Settings'}</Typography>
        </Box>

        <Box paddingLeft={2} paddingRight={2}>
            <ClusterTrailSettings></ClusterTrailSettings>
        </Box>

        <Box paddingLeft={2} paddingTop={2}>
            <Typography variant="subtitle2" gutterBottom>{'Stored Projections'}</Typography>
        </Box>

        <Box paddingLeft={2} paddingRight={2}>
            <Button
                onClick={(name) => onSaveProjectionClick(new Date().getHours() + ":" + new Date().getMinutes())}
                variant="outlined"
                size="small"
            >{'Store Projection'}</Button>
        </Box>

        <div style={{ overflowY: 'auto', height: '100px', flex: '1 1 auto' }}>
            <List dense={true}>
                {props.projections.map(projection => {
                    return <ListItem key={projection.hash} button onClick={() => onProjectionClick(projection)}>
                        <ListItemAvatar>
                            <Avatar>
                                <FolderIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${projection.name}`}
                            secondary={`${projection.positions.length} items`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => onDeleteProjectionClick(projection)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                })}
            </List>
        </div>
    </div>
})