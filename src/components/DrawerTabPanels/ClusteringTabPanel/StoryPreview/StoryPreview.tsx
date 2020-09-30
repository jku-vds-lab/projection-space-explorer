import * as React from 'react'
import { Story } from '../../../util/Cluster'
import { Button, Fade, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core';
import { connect } from 'react-redux'
import './StoryPreview.scss'
import DeleteIcon from '@material-ui/icons/Delete';
import { addStoryAction, deleteStoryAction } from '../../../Actions/Actions';

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
    }),
    deleteStory: story => dispatch(deleteStoryAction(story)),
    addStory: story => dispatch(addStoryAction(story))
})


export const StoryPreview = connect(mapStateToProps, mapDispatchToProps)(({ stories, setActiveStory, activeStory, deleteStory, addStory }) => {
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
})