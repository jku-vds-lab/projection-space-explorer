import * as React from 'react'
import { Button, FormControl, Grid, IconButton, InputLabel, ListItem, ListItemSecondaryAction, ListItemText, Select } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux'
import './StoryPreview.scss'
import DeleteIcon from '@material-ui/icons/Delete';
import { Storybook } from '../../Utility/Data/Storybook';
import { addStory, deleteStory, setActiveStory } from '../../Ducks/StoriesDuck';
import { RootState } from '../../Store/Store';

const mapStateToProps = (state: RootState) => ({
    stories: state.stories
})

const mapDispatchToProps = dispatch => ({
    setActiveStory: activeStory => dispatch(setActiveStory(activeStory)),
    deleteStory: story => dispatch(deleteStory(story)),
    addStory: story => dispatch(addStory(story))
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    addStory: any
}

export const StoryPreview = connector(({
    stories,
    setActiveStory,
    deleteStory,
    addStory}: Props) => {
    const deleteHandler = (story) => {
        if (stories.active == story) {
            setActiveStory(null)
        }

        deleteStory(story)
    }

    const addHandler = () => {
        addStory(new Storybook([], []))
    }
    
    return <div className="StoryPreviewContent">
        <FormControl>
            <InputLabel id="demo-simple-select-label">Active Story Book</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={stories.active ?? ''}
                onChange={(event) => {
                    setActiveStory(event.target.value)
                }}
            >
                <ListItem
                    key={-1}
                    {...{ value: '' }}
                    button
                >
                    <ListItemText primary={"None"} />
                </ListItem>
                {
                    stories.stories && stories.stories.map((story, key) => {
                        return <ListItem
                            key={key}
                            button
                            {...{ value: key }}
                        >
                            <ListItemText primary={"Story Book"} secondary={`${story.clusters.length} nodes`} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => {
                                    deleteHandler(story)
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    })
                }
            </Select>
        </FormControl>

        <Grid container direction="row" alignItems="center" justify="space-between">
            <Button
                style={{
                    marginTop: '16px'
                }}
                onClick={() => addHandler()}
                variant="outlined"
                size="small"
                aria-label="move selected left"
            >Add Empty</Button>
        </Grid>
    </div>
})