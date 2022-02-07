import { EntityId } from '@reduxjs/toolkit';
import * as React from 'react';
import { Button, FormControl, FormHelperText, Grid, IconButton, ListItem, ListItemSecondaryAction, ListItemText, Select } from '@mui/material';
import { connect, ConnectedProps } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { IBook, ABook } from '../../../model/Book';
import type { RootState } from '../../Store/Store';
import { StoriesActions } from '../../Ducks/StoriesDuck copy';

const mapStateToProps = (state: RootState) => ({
  stories: state.stories,
});

const mapDispatchToProps = (dispatch) => ({
  setActiveStory: (book: EntityId) => dispatch(StoriesActions.setActiveStoryBook({ book })),
  deleteStory: (book: EntityId) => dispatch(StoriesActions.deleteBookAsync({ book })),
  addStory: (book: IBook) => dispatch(StoriesActions.addBookAsync({ book, activate: true })),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

export const StoryPreview = connector(({ stories, setActiveStory, deleteStory, addStory }: Props) => {
  const deleteHandler = (story) => {
    if (stories.active === story) {
      setActiveStory(null);
    }

    deleteStory(story);
  };

  const addHandler = () => {
    addStory(ABook.createEmpty());
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'stretch',
      }}
    >
      <FormControl>
        <FormHelperText>Active Story Book</FormHelperText>
        <Select
          displayEmpty
          size="small"
          value={stories.active ?? ''}
          onChange={(event) => {
            setActiveStory(event.target.value);
          }}
        >
          <ListItem key="" {...{ value: '' }} button>
            <ListItemText primary="None" />
          </ListItem>
          {stories.stories &&
            stories.stories.ids
              .map((id) => stories.stories.entities[id])
              .map((story) => {
                return (
                  <ListItem key={story.id} button {...{ value: story.id }}>
                    <ListItemText primary="Story Book" secondary={`${Object.keys(story.clusters.entities).length} nodes`} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          deleteHandler(story);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
        </Select>
      </FormControl>

      <Grid container direction="row" alignItems="center" justifyContent="space-between">
        <Button
          style={{
            marginTop: '16px',
          }}
          onClick={() => addHandler()}
          variant="outlined"
          size="small"
          aria-label="move selected left"
        >
          Add Empty
        </Button>
      </Grid>
    </div>
  );
});
