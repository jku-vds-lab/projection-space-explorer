/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { usePSESelector } from '../../Store/Store';

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  onCancel: any;
};

export function DownloadProgress({ onCancel }: Props) {
  const job = usePSESelector((state) => state.datasetLoader);

  return (
    <Dialog disableEscapeKeyDown maxWidth="xs" aria-labelledby="confirmation-dialog-title" open={job.isFetching} fullWidth>
      <DialogTitle id="confirmation-dialog-title">Download progress</DialogTitle>
      <DialogContent dividers>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Box position="relative" display="inline-flex" m={2}>
            <CircularProgress size="128px" />
            <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
              <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(job.progress / 1000)}kb`}</Typography>
            </Box>
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            onCancel();
          }}
          color="primary"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
