import { EntityId } from '@reduxjs/toolkit';
import { useState } from 'react';
import * as React from 'react';
import { Button, FormControl, FormHelperText, Grid, ListItem, ListItemText, Select, Tooltip } from '@mui/material';
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import { IBook } from '../../../model/Book';
import type { RootState } from '../../Store/Store';
import { StoriesActions, AStorytelling } from '../../Ducks/StoriesDuck';
import { EditBookDialog } from '../EmbeddingTabPanel/EditBookDialog';
import { toSentenceCase } from '../../../utils/helpers';

const mapStateToProps = (state: RootState) => ({
  stories: state.stories,
  globalLabels: state.globalLabels,
});

const mapDispatchToProps = (dispatch) => ({
  setActiveStory: (book: EntityId) => dispatch(StoriesActions.setActiveStoryBook(book)),
  deleteStory: (book: EntityId) => dispatch(StoriesActions.deleteBookAsync(book)),
  addStory: (book: IBook) => dispatch(StoriesActions.addBookAsync({ book, activate: true })),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

export const StoryPreview = connector(({ stories, setActiveStory, deleteStory, addStory, globalLabels }: Props) => {
  const [editBook, setEditBook] = useState<IBook>(null);

  const deleteHandler = (story) => {
    if (stories.active === story) {
      setActiveStory(null);
    }

    deleteStory(story);
  };

  const addHandler = () => {
    addStory(AStorytelling.emptyStory());
  };

  const dispatch = useDispatch();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'stretch',
      }}
    >
      <FormControl>
        <FormHelperText>Active {globalLabels.storyBookLabel}</FormHelperText>
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
                    <ListItemText
                      primary={toSentenceCase(story.name ?? globalLabels.storyBookLabel)}
                      secondary={`${Object.keys(story.clusters.entities).length} nodes`}
                    />
                  </ListItem>
                );
              })}
        </Select>
      </FormControl>

      <Grid container direction="row" alignItems="center" justifyContent="space-between">
        <Tooltip placement="bottom" title={`Creates an empty ${globalLabels.storyBookLabel} (group and edge container) that can be used to save groups`}>
          <Button
            style={{
              marginTop: '16px',
            }}
            onClick={() => addHandler()}
            variant="outlined"
            size="small"
          >
            Add empty
          </Button>
        </Tooltip>

        {stories.active ? (
          <Tooltip placement="bottom" title={`Opens a dialog that allows to edit the currently selected ${globalLabels.storyBookLabel}`}>
            <Button
              style={{
                marginTop: '16px',
              }}
              variant="outlined"
              size="small"
              onClick={() => {
                setEditBook(stories.stories.entities[stories.active]);
              }}
            >
              Edit Selected
            </Button>
          </Tooltip>
        ) : null}
      </Grid>

      <EditBookDialog
        book={editBook}
        onClose={() => {
          setEditBook(null);
        }}
        onSave={(id: EntityId, changes: any) => {
          dispatch(StoriesActions.changeBookName({ id: editBook.id, name: changes.name }));
          setEditBook(null);
        }}
        onDelete={() => {
          deleteHandler(editBook.id);
          setEditBook(null);
        }}
      />
    </div>
  );
});
