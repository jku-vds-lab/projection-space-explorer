import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import * as React from 'react';
import { EntityId } from '@reduxjs/toolkit';
import type { IProjection } from '../../../model';

function FeatureList() {
  return null;
}

export function EditProjectionDialog({
  projection,
  onClose,
  onSave,
  onDelete,
}: {
  projection: IProjection;
  onClose: () => void;
  onSave: (id: EntityId, changes: any) => void;
  onDelete: (id: EntityId) => void;
}) {
  const [name, setName] = React.useState(projection?.name);

  React.useEffect(() => {
    if (projection) {
      setName(projection.name);
    }
  }, [projection]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSave(projection.hash, { name });
  };

  return (
    <Dialog open={projection !== null} onClose={onClose}>
      <Box component="form" onSubmit={onSubmit}>
        <DialogTitle>{`Edit projection ${projection?.name}`}</DialogTitle>

        <DialogContent>
          <TextField required label="Name" fullWidth value={name} onChange={(event) => setName(event.target.value)} sx={{ mt: 1 }} />
        </DialogContent>

        <FeatureList />

        <DialogActions>
          <IconButton onClick={() => onDelete(projection?.hash)}>
            <DeleteIcon />
          </IconButton>

          <Button sx={{ ml: 'auto' }} type="submit">
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
