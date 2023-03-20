import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip, Typography } from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { ACluster, IBook } from '../../../model';

export function EditBookDialog({
  storyBookLabel,
  book,
  onClose,
  onSave,
  onDelete,
}: {
  storyBookLabel: string;
  book: IBook;
  onClose: () => void;
  onSave: (id: EntityId, changes: any) => void;
  onDelete: (id: EntityId) => void;
}) {
  const [name, setName] = React.useState(book?.name);

  React.useEffect(() => {
    if (book) {
      setName(book.name);
    }
  }, [book]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSave(book.id, { name });
  };

  return (
    <Dialog open={book !== null} onClose={onClose}>
      <Box component="form" onSubmit={onSubmit}>
        <DialogTitle>{`Settings for active ${storyBookLabel} ${book?.name ? book.name : ''}`}</DialogTitle>

        <DialogContent>
          <Tooltip title={<Typography variant="subtitle2">Delete the selected {storyBookLabel}</Typography>}>
            <Button
              variant="outlined"
              fullWidth
              color="error"
              onClick={() => {
                onDelete(book.id);
                onClose();
              }}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </Tooltip>
          <TextField label={`Rename ${storyBookLabel}`} fullWidth value={name ?? ''} onChange={(event) => setName(event.target.value)} sx={{ mt: 1 }} />
        </DialogContent>

        <DialogActions>
          <Button sx={{ ml: 'auto' }} onClick={() => onClose()}>
            Close
          </Button>
          <Button sx={{ ml: 'auto' }} type="submit">
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
