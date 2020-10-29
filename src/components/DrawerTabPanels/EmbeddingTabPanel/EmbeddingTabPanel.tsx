import { connect, ConnectedProps } from 'react-redux'
import React = require('react')
import { FlexParent } from '../../util/FlexParent'
import { Button, Dialog } from '@material-ui/core'
import { ProjectionControlCard } from './ProjectionControlCard/ProjectionControlCard'
import { setProjectionOpenAction } from "../../Ducks/ProjectionOpenDuck"
import { setProjectionWorkerAction } from "../../Ducks/ProjectionWorkerDuck"
import { DataLine, Dataset } from '../../util/datasetselector'
import { ForceEmbedding } from './ForceEmbedding/ForceEmbedding'
import { GenericSettings } from './GenericSettings/GenericSettings'
import { RootState } from '../../Store/Store'
import { setProjectionParamsAction } from '../../Ducks/ProjectionParamsDuck'
import { setProjectionColumns } from '../../Ducks/ProjectionColumnsDuck'
import { TSNEEmbeddingController } from './EmbeddingController/TSNEEmbeddingController'
import { UMAPEmbeddingController } from './EmbeddingController/UMAPEmbeddingController'
import { ClusterTrailSettings } from './ClusterTrailSettings/ClusterTrailSettings'
import { setTrailVisibility } from '../../Ducks/TrailSettingsDuck'
const Graph = require('graphology');

const mapStateToProps = (state: RootState) => ({
    currentAggregation: state.currentAggregation,
    stories: state.stories,
    activeStory: state.activeStory,
    storyMode: state.storyMode,
    projectionWorker: state.projectionWorker,
    projectionOpen: state.projectionOpen,
    dataset: state.dataset,
    webGLView: state.webGLView,
    projectionParams: state.projectionParams
})

const mapDispatchToProps = dispatch => ({
    setProjectionOpen: value => dispatch(setProjectionOpenAction(value)),
    setProjectionWorker: value => dispatch(setProjectionWorkerAction(value)),
    setProjectionParams: value => dispatch(setProjectionParamsAction(value)),
    setProjectionColumns: value => dispatch(setProjectionColumns(value)),
    setTrailVisibility: visibility => dispatch(setTrailVisibility(visibility))
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


    return <FlexParent
        alignItems='stretch'
        flexDirection='column'
        justifyContent=''
    >
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
            }}
            onStep={(Y) => {
                props.dataset.vectors.forEach((vector, i) => {
                    vector.x = Y[i][0]
                    vector.y = Y[i][1]
                })
                props.webGLView.current.updateXY()
                props.webGLView.current.repositionClusters()
            }} />



        <ForceEmbedding></ForceEmbedding>


        <Button
            variant="outlined"
            onClick={() => {
                setDomainSettings('umap')
                setOpen(true)
            }}>{'UMAP'}</Button>

        <Button
            variant="outlined"
            onClick={() => {
                setDomainSettings('tsne')
                setOpen(true)
            }}>{'t-SNE'}</Button>


        <GenericSettings
            projectionParams={props.projectionParams}
            domainSettings={domainSettings}
            open={open} onClose={() => setOpen(false)}
            onStart={(params, selection) => {
                setOpen(false)
                props.setProjectionColumns(selection)
                props.setProjectionParams(params)

                let worker = null
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

                }
            }}
        ></GenericSettings>

        
        <ClusterTrailSettings></ClusterTrailSettings>
    </FlexParent>
})