/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Card, CardHeader, IconButton, Alert, LinearProgress, CardContent, Box, Typography, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import CloseIcon from '@mui/icons-material/Close';
import { connect, ConnectedProps } from 'react-redux';
import { makeStyles } from '@mui/styles';
import type { RootState } from '../../Store/Store';
import { EmbeddingController } from './EmbeddingController';

/**
 * Styles for the projection card that allows to stop/resume projection steps.
 */
const useStylesMedia = makeStyles(() => ({
  root: {
    display: 'flex',
    margin: '8px 0',
    pointerEvents: 'auto',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    // paddingLeft: theme.spacing(1),
    // paddingBottom: theme.spacing(1),
    width: '100%',
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

const mapStateToProps = (state: RootState) => ({
  projectionParams: state.projectionParams,
  worker: state.projectionWorker,
});

const mapDispatch = () => ({});

const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  onClose: any;
  onComputingChanged: any;
  controller: EmbeddingController;
  dataset_name: string;
  onStep?: any;
};

/**
 * Projection card that allows to start/stop the projection and shows the current steps.
 */
export const ProjectionControlCard = connector(({ onComputingChanged, projectionParams, controller, onClose, dataset_name, onStep }: Props) => {
  if (controller == null) return null;

  const classes = useStylesMedia();

  const [step, setStep] = React.useState(0);
  const [msg, setMsg] = React.useState('');
  const ref = React.useRef(step);

  const [errornous, setErrornous] = React.useState<ErrorEvent>();

  if (step === 0) {
    console.time(`time elapsed to project the file ${dataset_name}`);
  }
  if (step / projectionParams.iterations >= 1) {
    console.timeEnd(`time elapsed to project the file ${dataset_name}`);
  }

  const [computing, setComputing] = React.useState(true);

  function updateState(newState) {
    ref.current = newState;
    setStep(newState);
  }

  controller.notifier = (step?: number, msg?: string) => {
    setMsg(msg);
    let new_step = ref.current + 1;
    if (step != null && !Number.isNaN(step)) {
      // checks if step is not null or undefined or nan
      new_step = step;
    }
    updateState(new_step);
    if (onStep && !errornous) {
      onStep(new_step);
    }
  };

  controller.error = (msg) => {
    setErrornous(msg);
  };

  React.useEffect(() => {
    if (step < projectionParams.iterations && computing && !errornous) {
      controller.step();
    }
  }, [step, computing]);

  const percent = Math.min((step / projectionParams.iterations) * 100, 100);

  const genlabel = (step) => {
    if (step === 0) {
      return (
        <Typography variant="caption">
          <div>Initializing projection ...</div>
          {msg && <div>Server: {msg}</div>}
        </Typography>
      );
    }

    return (
      <div>
        <div>{`${Math.min(step, projectionParams.iterations)}/${projectionParams.iterations} iterations`}</div>
        <div>{`${percent.toFixed(1)}%`}</div>
        {msg && <div>Server: {msg}</div>}
      </div>
    );
  };

  return !errornous ? (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardHeader
          avatar={<div />}
          action={
            <Tooltip title={<Typography variant="subtitle2">Cancel projection</Typography>}>
              <IconButton
                aria-label="settings"
                data-cy="projection-control-card-close-button"
                onClick={() => {
                  console.timeEnd(`time elapsed to project the file ${dataset_name}`);
                  onClose();
                }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          }
          title={projectionParams.method}
        />

        <Box px={3} pb={1}>
          {percent < 100 && computing ? <LinearProgress style={{ marginBottom: '4px' }} /> : null}
          {genlabel(step)}
        </Box>

        {controller.supportsPause() ? (
          <div className={classes.controls}>
            <IconButton
              aria-label="play/pause"
              data-cy="projection-card-play-pause-button"
              onClick={() => {
                const newVal = !computing;
                setComputing(newVal);
                onComputingChanged(null, newVal);
              }}
            >
              {computing ? <StopIcon className={classes.playIcon} /> : <PlayArrowIcon className={classes.playIcon} />}
            </IconButton>
          </div>
        ) : null}
      </div>
    </Card>
  ) : (
    <Alert variant="outlined" severity="error" onClose={onClose} style={{ marginRight: 16, marginBottom: 8 }}>
      Projection failed - {errornous.message}
    </Alert>
  );
});
