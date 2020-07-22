import * as React from 'react'
import { Story } from '../../../util/Cluster'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { FingerprintPreview } from '../FingerprintPreview/FingerprintPreview';
import { Fade, Typography } from '@material-ui/core';
import { connect } from 'react-redux'
import './StoryPreview.scss'
import { GenericFingerprint } from '../../../legends/Generic';

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
    return <Fade in={stories != null && stories.length > 0}>
        <div className="StoryPreviewContent">
            <ToggleButtonGroup
                value={activeStory}
                exclusive
                onChange={(e, newValue) => setActiveStory(newValue)}
                style={{
                    alignItems: "stretch"
                }}
                orientation='vertical'
            >
                {
                    stories?.map((story, index) => {
                        return <ToggleButton key={index} value={story}
                            style={{
                                flexGrow: 1,
                                display: 'flex',
                                justifyContent: 'end'
                            }}>
                             
                            <Typography>Story {index}</Typography>
                        </ToggleButton>
                    })
                }
            </ToggleButtonGroup>
        </div>
    </Fade>
})

//<FingerprintPreview type={type} pointClusters={story.clusters}></FingerprintPreview>
//<GenericFingerprint type={type} vectors={story.clusters[0].vectors} scale={0.5}></GenericFingerprint>