/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { DownloadJob } from './DownloadJob';

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  job: DownloadJob;
  onFinish: any;
  onCancel: any;
};

export function DownloadProgress({ job, onFinish, onCancel }: Props) {
  const [progress, setProgress] = React.useState(0);
  const [, setFinished] = React.useState(false);

  React.useEffect(() => {
    if (job) {
      job.start(
        (result) => {
          setFinished(true);
          onFinish(result);
        },
        (progress) => {
          setProgress(progress);
        },
      );
    }
  }, [job]);

  return (
    <Dialog disableEscapeKeyDown maxWidth="xs" aria-labelledby="confirmation-dialog-title" open={job != null} fullWidth>
      <DialogTitle id="confirmation-dialog-title">Download progress</DialogTitle>
      <DialogContent dividers>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Box position="relative" display="inline-flex" m={2}>
            <CircularProgress size="128px" />
            <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
              <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(progress / 1000)}kb`}</Typography>
            </Box>
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            job.terminate();
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
