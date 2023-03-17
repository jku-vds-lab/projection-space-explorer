import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import type { IBook } from '../../../model';

export function EditBookDialog({
  storyBookLabel,
  book,
  onClose,
  onSave,
}: {
  storyBookLabel: string;
  book: IBook;
  onClose: () => void;
  onSave: (id: EntityId, changes: any) => void;
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
        <DialogTitle>{`Rename ${storyBookLabel} ${book?.name ? book.name : ''}`}</DialogTitle>

        <DialogContent>
          <TextField required label="Name" fullWidth value={name ?? ''} onChange={(event) => setName(event.target.value)} sx={{ mt: 1 }} />
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
