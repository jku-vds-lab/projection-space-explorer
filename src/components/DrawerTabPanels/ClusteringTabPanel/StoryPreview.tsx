import { EntityId } from '@reduxjs/toolkit';
import { useState } from 'react';
import * as React from 'react';
import { Box, Button, FormControl, FormHelperText, Grid, ListItem, ListItemText, MenuItem, Select, Tooltip, Typography } from '@mui/material';
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
          <MenuItem value="">None</MenuItem>
          {stories.stories &&
            stories.stories.ids
              .map((id) => stories.stories.entities[id])
              .map((story) => {
                return (
                  <MenuItem key={story.id} value={story.id} sx={{ display: 'block' }}>
                    <div>{toSentenceCase(story.name ?? globalLabels.storyBookLabel)}</div>
                    <Typography variant="caption">{`${Object.keys(story.clusters.entities).length} nodes`}</Typography>
                  </MenuItem>
                );
              })}
        </Select>
      </FormControl>
      <Box paddingX={0} paddingTop={1} gap={1} sx={{ display: 'flex' }}>
        <Tooltip
          placement="bottom"
          title={<Typography variant="subtitle2">Creates an empty {globalLabels.storyBookLabel} that can be used to save groups and edges</Typography>}
        >
          <Button
            style={{ marginRight: '2px' }}
            variant="outlined"
            startIcon={<Add />}
            onClick={(e) => addHandler()}
            color="primary"
            aria-label={`Add empty ${globalLabels.storyBookLabel}`}
          >
            New
            {/* {globalLabels.storyBookLabel} */}
          </Button>
        </Tooltip>
        <Tooltip placement="bottom" title={<Typography variant="subtitle2">Change settings for active {globalLabels.storyBookLabel}</Typography>}>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            disabled={stories.active == null}
            onClick={(e) => {
              setEditBook(stories.stories.entities[stories.active]);
            }}
            color="primary"
            aria-label={`Edit selected ${globalLabels.storyBookLabel}`}
          >
            Settings
          </Button>
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
