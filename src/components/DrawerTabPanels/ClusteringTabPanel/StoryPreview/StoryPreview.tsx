import * as React from 'react'
import { Story } from '../../../util/Cluster'
import { Button, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux'
import './StoryPreview.scss'
import DeleteIcon from '@material-ui/icons/Delete';
import { addStoryAction, deleteStoryAction, setActiveStoryAction } from '../../../Actions/Actions';

type OwnProps = {
    stories: Story[]
    onChange: any
    activeStory: any
    type: String
    addStory: any
}

type StateProps = {

}

type DispatchProps = {
    setActiveStory: any
    deleteStory: any
}

type Props = StateProps & DispatchProps & OwnProps

const StoryPreviewFull = ({
    stories, setActiveStory, activeStory,
    deleteStory, addStory }: Props) => {
    const deleteHandler = (story) => {
        if (activeStory == story) {
            setActiveStory(null)
        }

        deleteStory(story)
    }

    const addHandler = () => {
        addStory(new Story([], []))
    }

    return <div className="StoryPreviewContent">
        <List component="nav">
            {
                stories?.map((story, index) => {

                    return <ListItem
                        button
                        selected={activeStory == story}
                        onClick={(event) => setActiveStory(story)}
                    >
                        <ListItemText primary={"Story " + index} secondary={`${story.clusters.length} nodes`} />
                        <ListItemSecondaryAction onClick={() => {
                            deleteHandler(story)
                        }}>
                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                })
            }
        </List>

        <Grid container direction="row" alignItems="center">
            <Button
                onClick={() => addHandler()}
                variant="outlined"
                size="small"
                aria-label="move selected left"
            >Add Story</Button>
        </Grid>
    </div>
}


const mapStateToProps = state => ({
    activeStory: state.activeStory
})

const mapDispatchToProps = dispatch => ({
    setActiveStory: activeStory => dispatch(setActiveStoryAction(activeStory)),
    deleteStory: story => dispatch(deleteStoryAction(story)),
    addStory: story => dispatch(addStoryAction(story))
})

export const StoryPreview = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(StoryPreviewFull)