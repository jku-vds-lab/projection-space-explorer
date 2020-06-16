import * as React from 'react'
import { FunctionComponent } from 'react'
import { Story } from '../../library/Cluster'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { FingerprintPreview } from '../FingerprintPreview/FingerprintPreview';
import { Fade } from '@material-ui/core';
import { connect } from 'react-redux'

type StoryPreviewProps = {
    stories: Story[]
    onChange: any
    activeStory: number
    type: String
}


const mapStateToProps = state => ({
    activeStory: state.activeStory
})

const mapDispatchToProps = dispatch => ({
    setActiveStory: activeStory => dispatch({
        type: 'SET_ACTIVE_STORY',
        activeStory: activeStory
    })
})

export var StoryPreview = connect(mapStateToProps, mapDispatchToProps)(({ stories, setActiveStory, activeStory, type }) => {
    return <Fade in={stories != null && stories.length > 0}><div>
        <h6>Stories</h6>
        <hr></hr>
        <ToggleButtonGroup
            value={activeStory}
            exclusive
            onChange={(e, newValue) => setActiveStory(newValue)}
            style={{
                alignItems: "stretch"
            }}
        >
            {
                stories?.map((story, index) => {
                    return <ToggleButton key={index} value={story} style={{ flexGrow: 1 }}>
                        <FingerprintPreview type={type} pointClusters={story.clusters}></FingerprintPreview>
                    </ToggleButton>
                })
            }
        </ToggleButtonGroup>
    </div></Fade>
})