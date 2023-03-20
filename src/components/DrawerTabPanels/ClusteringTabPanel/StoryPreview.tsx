import { EntityId } from '@reduxjs/toolkit';
import { useState } from 'react';
import * as React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  ListItem,
  ListItemText,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import { Add, Settings } from '@mui/icons-material';
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
      <Box paddingX={0} paddingTop={1}>
        <Tooltip
          placement="bottom"
          title={<Typography variant="subtitle2">Creates an empty {globalLabels.storyBookLabel} that can be used to save groups and edges</Typography>}
        >
          <Button style={{marginRight:"2px"}} variant='outlined' startIcon={<Add />} onClick={(e) => addHandler()} color="primary" aria-label={`Add empty ${globalLabels.storyBookLabel}`}>
            New 
            {/* {globalLabels.storyBookLabel} */}
          </Button>
        </Tooltip>
        <Tooltip placement="bottom" title={<Typography variant="subtitle2">Change settings for active {globalLabels.storyBookLabel}</Typography>}>
          <span>
            <Button variant='outlined' startIcon={<Settings />} 
              disabled={stories.active == null}
              onClick={(e) => {
                setEditBook(stories.stories.entities[stories.active]);
              }}
              color="primary"
              aria-label={`Edit selected ${globalLabels.storyBookLabel}`}>
              Settings
            </Button>
          </span>
        </Tooltip>

      </Box>

      <EditBookDialog
        storyBookLabel={globalLabels.storyBookLabel}
        book={editBook}
        onClose={() => {
          setEditBook(null);
        }}
        onSave={(id: EntityId, changes: any) => {
          dispatch(StoriesActions.changeBookName({ id: editBook.id, name: changes.name }));
          setEditBook(null);
        }}
        onDelete={(e) => {
          deleteHandler(stories.stories.entities[stories.active].id);
          setEditBook(null);
        }}
      />
    </div>
  );
});
