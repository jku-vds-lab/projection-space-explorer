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
import { BrandingWatermark } from '@material-ui/icons'
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
    setProjectionColumns: value => dispatch(setProjectionColumns(value))
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

const modal = () => {
    return <Dialog
        open={false}
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
    </Dialog>
}


export const EmbeddingTabPanel = connector((props: Props) => {
    const [input, setInput] = React.useState(null)

    const [open, setOpen] = React.useState(false)
    const [domainSettings, setDomainSettings] = React.useState('')



    return <FlexParent
        alignItems='stretch'
        flexDirection='column'
        margin='0 16px'
        justifyContent=''
    >
        <ProjectionControlCard
            input={input}
            onClose={() => {
                if (props.projectionWorker) {
                    props.projectionWorker.terminate()
                }

                setInput(null)
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


        <Button onClick={() => {
            setDomainSettings('umap')
            setOpen(true)
        }}>{'UMAP'}</Button>

        <Button onClick={() => {
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
                    case 'tsne':
                        worker = new Worker('dist/tsne.js')
                        worker.postMessage({
                            messageType: 'init',
                            input: props.dataset.asTensor(selection.filter(e => e.checked)),
                            seed: props.dataset.vectors.map(sample => [sample.x, sample.y]),
                            params: params
                        })
                        break;
                    case 'umap':
                        worker = new Worker('dist/umap.js')
                        worker.postMessage({
                            messageType: 'init',
                            input: props.dataset.asTensor(selection.filter(e => e.checked)),
                            seed: props.dataset.vectors.map(sample => [sample.x, sample.y]),
                            params: params
                        })
                        break;
                }

                props.setProjectionWorker(worker)

                setInput({ seed: props.dataset.vectors.map(sample => [sample.x, sample.y]), data: props.dataset.asTensor(selection.filter(e => e.checked)) })
            }}
        ></GenericSettings>

    </FlexParent>
})