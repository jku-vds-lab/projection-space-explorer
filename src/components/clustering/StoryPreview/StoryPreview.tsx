import * as React from 'react'
import { FunctionComponent } from 'react'
import { Story } from '../../library/Cluster'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { FingerprintPreview } from '../FingerprintPreview/FingerprintPreview';
import { Fade } from '@material-ui/core';


type StoryPreviewProps = {
    stories: Story[]
    onChange: any
    activeStory: number
}

export const StoryPreview: FunctionComponent<StoryPreviewProps> = ({ stories, onChange, activeStory }) => {
    return <Fade in={stories != null && stories.length > 0}><div>
        <h6>Stories</h6>
        <hr></hr>
        <ToggleButtonGroup
            value={activeStory}
            exclusive
            onChange={onChange}
            style={{
                alignItems: "stretch"
            }}
        >
            {
                stories?.map((story, index) => {
                    return <ToggleButton key={index} value={story} style={{ flexGrow: 1 }}>
                        <FingerprintPreview type='rubik' pointClusters={story.clusters}></FingerprintPreview>
                    </ToggleButton>
                })
            }
        </ToggleButtonGroup>
    </div></Fade>
}