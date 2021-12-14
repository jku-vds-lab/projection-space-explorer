import { connect, ConnectedProps } from 'react-redux'
import React = require('react')
import { Avatar, Box, Button, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from '@mui/material'
import { ProjectionControlCard } from './ProjectionControlCard'
import { setProjectionOpenAction } from "../../Ducks/ProjectionOpenDuck"
import { setProjectionWorkerAction } from "../../Ducks/ProjectionWorkerDuck"
import { Dataset } from "../../../model/Dataset"
import { GenericSettings } from './GenericSettings'
import { RootState } from '../../Store/Store'
import { setProjectionColumns } from '../../Ducks/ProjectionColumnsDuck'
import { TSNEEmbeddingController } from './TSNEEmbeddingController'
import { UMAPEmbeddingController } from './UMAPEmbeddingController'
import { ClusterTrailSettings } from './ClusterTrailSettings'
import { setTrailVisibility } from '../../Ducks/TrailSettingsDuck'
import { ForceAtlas2EmbeddingController } from './ForceAtlas2EmbeddingController'
import { IProjection, AProjection, IBaseProjection } from '../../../model/Projection'
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

import { FeatureConfig } from '../../../Application'
import { updateWorkspaceAction, addProjectionAction, deleteProjectionAction } from '../../Ducks/ProjectionDuck'
import { DEFAULT_EMBEDDINGS, EmbeddingMethod } from '../../..'

const mapStateToProps = (state: RootState) => ({
    // currentAggregation: state.currentAggregation,
    stories: state.stories,
    projectionWorker: state.projectionWorker,
    projectionOpen: state.projectionOpen,
    dataset: state.dataset,
    // projectionParams: state.projectionParams,
    projections: state.projections,
    workspace: state.projections.workspace
})

const mapDispatchToProps = dispatch => ({
    setProjectionOpen: value => dispatch(setProjectionOpenAction(value)),
    setProjectionWorker: value => dispatch(setProjectionWorkerAction(value)),
    // setProjectionParams: value => dispatch(setProjectionParamsAction(value)),
    setProjectionColumns: value => dispatch(setProjectionColumns(value)),
    setTrailVisibility: visibility => dispatch(setTrailVisibility(visibility)),
    addProjection: embedding => dispatch(addProjectionAction(embedding)),
    deleteProjection: (handle: string) => dispatch(deleteProjectionAction(handle)),
    updateWorkspace: (workspace: IBaseProjection) => dispatch(updateWorkspaceAction(workspace))
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    config: FeatureConfig
    projectionWorker?: Worker
    projectionOpen?: boolean
    setProjectionOpen?: any
    setProjectionWorker?: any
    dataset?: Dataset
    webGLView?: any
}

const EmbeddingMethodButtons = (props:{setOpen, setDomainSettings, embeddings?: EmbeddingMethod[]}) => {
    // use == instead of === to also check if it is undefined
    if(props.embeddings == null || props.embeddings.length <= 0){
        props.embeddings = DEFAULT_EMBEDDINGS;
    }
    return <Grid container direction="column" spacing={1}> 
        {props.embeddings.map((emb) => 
            <Grid key={emb.id} item>
                <Button
                    style={{
                        width: '100%'
                    }}
                    variant="outlined"
                    onClick={() => {
                        props.setDomainSettings(emb)
                        props.setOpen(true)
                    }}>{emb.name}</Button>
            </Grid>)
        }
    </Grid>
}

export const EmbeddingTabPanel = connector((props: Props) => {
    const [open, setOpen] = React.useState(false)
    const [domainSettings, setDomainSettings] = React.useState({id:"", name:"", embController:null})

    const [controller, setController] = React.useState(null)

    React.useEffect(() => {
        if (controller) {
            controller.terminate()
        }
        setController(null)
        props.setTrailVisibility(false)
    }, [props.dataset]);


    const onSaveProjectionClick = (name) => {
        props.addProjection(AProjection.createProjection(props.workspace, "Created " + name))
    }

    const onProjectionClick = (projection: IProjection) => {
        props.updateWorkspace(projection.positions)
    }

    const onDeleteProjectionClick = (handle: string) => {
        props.deleteProjection(handle)
    }


    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box paddingLeft={2} paddingTop={2}>
            <Typography variant="subtitle2" gutterBottom>{'Projection Methods'}</Typography>
        </Box>

        <Box paddingLeft={2} paddingRight={2}>
            <EmbeddingMethodButtons setOpen={setOpen} setDomainSettings={setDomainSettings} embeddings={props.config?.embeddings}></EmbeddingMethodButtons>
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
            // projectionParams={props.projectionParams}
            domainSettings={domainSettings}
            open={open} onClose={() => setOpen(false)}
            onStart={(params, selection) => {
                const checked_sel = selection.filter(s => s.checked)
                if (checked_sel.length <= 0) {
                    alert("Select at least one feature.")
                    return;
                }

                setOpen(false)
                props.setProjectionColumns(selection)
                // props.setProjectionParams(params)
                
                switch (domainSettings.id) {
                    case 'tsne': {
                        let controller = new TSNEEmbeddingController()
                        controller.init(props.dataset, selection, params, props.workspace)
                        controller.stepper = (Y) => {
                            const workspace = Y.map(y => ({ x: y[0], y: y[1] }));
                            props.updateWorkspace(workspace);
                        }

                        setController(controller)
                        break;
                    }

                    case 'umap': {
                        let controller = new UMAPEmbeddingController()

                        controller.init(props.dataset, selection, params, props.workspace)
                        controller.stepper = (Y) => {
                            const workspace = props.dataset.vectors.map((sample, i) => {
                                return {
                                    x: Y[i][0],
                                    y: Y[i][1]
                                }
                            })
                            props.updateWorkspace(workspace)
                        }


                        setController(controller)
                        break;
                    }
                    case 'forceatlas2': {
                        let controller = new ForceAtlas2EmbeddingController()
                        controller.init(props.dataset, selection, params)

                        controller.stepper = (Y) => {
                            const workspace = props.dataset.vectors.map((sample, i) => {
                                let idx = controller.nodes[sample.__meta__.duplicateOf].__meta__.meshIndex
                                return {
                                    x: Y[idx].x,
                                    y: Y[idx].y
                                }
                            })

                            props.updateWorkspace(workspace)
                        }

                        setController(controller)
                        break;
                    }
                    default: {
                        // custom embedding controller
                        if(domainSettings.embController){
                            let controller = domainSettings.embController;
    
                            controller.init(props.dataset, selection, params, props.workspace)
                            controller.stepper = (Y:IBaseProjection) => {
                                // const workspace = props.dataset.vectors.map((sample, i) => {
                                //     return {
                                //         x: Y[i].x,
                                //         y: Y[i].y
                                //     }
                                // })
                                // props.updateWorkspace(workspace)
                                props.updateWorkspace(Y)
                            }
    
                            setController(controller)
                        }
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
                {props.projections.allIds.map(key => {
                    const projection = props.projections.byId[key]
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
                            <IconButton onClick={() => onDeleteProjectionClick(key)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                })}
            </List>
        </div>
    </div>
})