import * as React from 'react'
import { Story } from '../../../util/Cluster'
import { Button, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux'
import './StoryPreview.scss'
import DeleteIcon from '@material-ui/icons/Delete';
import { setActiveStory } from '../../../Ducks/ActiveStoryDuck';
import { addStory, deleteStory } from '../../../Ducks/StoriesDuck';

const mapStateToProps = state => ({
    activeStory: state.activeStory
})

const mapDispatchToProps = dispatch => ({
    setActiveStory: activeStory => dispatch(setActiveStory(activeStory)),
    deleteStory: story => dispatch(deleteStory(story)),
    addStory: story => dispatch(addStory(story))
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    stories: Story[]
    activeStory: any
    addStory: any
}

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
                        key={index}
                        button
                        selected={activeStory == story}
                        onClick={(event) => {
                            if (activeStory == story) {
                                setActiveStory(null)
                            } else {
                                setActiveStory(story)
                            }
                        }}
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


export const StoryPreview = connector(StoryPreviewFull)