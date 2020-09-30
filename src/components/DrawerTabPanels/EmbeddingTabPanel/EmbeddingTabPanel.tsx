import { connect } from 'react-redux'
import { FunctionComponent } from 'react'
import React = require('react')
import { FlexParent } from '../../util/FlexParent'
import { Button, Divider, Grid } from '@material-ui/core'
import { ProjectionControlCard } from './ProjectionControlCard/ProjectionControlCard'
import { setProjectionOpenAction, setProjectionWorkerAction } from '../../Actions/Actions'
import { Dataset } from '../../util/datasetselector'
import { TensorLoader } from './TensorLoader/TensorLoader'
import { ForceEmbedding } from './ForceEmbedding/ForceEmbedding'

type EmbeddingTabPanelProps = {
    projectionWorker?: Worker
    projectionOpen?: boolean
    setProjectionOpen?: any
    setProjectionWorker?: any
    dataset?: Dataset
    webGLView?: any
}

const mapStateToProps = state => ({
    currentAggregation: state.currentAggregation,
    stories: state.stories,
    activeStory: state.activeStory,
    storyMode: state.storyMode,
    projectionWorker: state.projectionWorker,
    projectionOpen: state.projectionOpen,
    dataset: state.dataset,
    webGLView: state.webGLView
})

const mapDispatchToProps = dispatch => ({
    setProjectionOpen: value => dispatch(setProjectionOpenAction(value)),
    setProjectionWorker: value => dispatch(setProjectionWorkerAction(value))
})


export const EmbeddingTabPanel: FunctionComponent<EmbeddingTabPanelProps> = connect(mapStateToProps, mapDispatchToProps)((props: EmbeddingTabPanelProps) => {
    const [input, setInput] = React.useState(null)

    return <FlexParent
        alignItems='stretch'
        flexDirection='column'
        margin='0 16px'
        justifyContent=''
    >
        <Button
            style={{
                margin: '8px 0'
            }}
            onClick={() => {
                props.setProjectionOpen(true)
            }}>Start Projection</Button>

        <TensorLoader
            onTensorInitiated={(event, selected) => {
                props.setProjectionWorker(new Worker('dist/worker.js'))

                setInput(props.dataset.asTensor(selected))
            }}
        ></TensorLoader>

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
            }} />




        <Divider></Divider>

        <ForceEmbedding></ForceEmbedding>
    </FlexParent>
})