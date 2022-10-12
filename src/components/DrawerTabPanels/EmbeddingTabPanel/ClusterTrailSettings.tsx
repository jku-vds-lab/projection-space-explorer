import { FormControlLabel, FormGroup, Slider, Switch, Typography } from '@mui/material';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { setTrailLength, setTrailVisibility } from '../../Ducks/TrailSettingsDuck';
import type { RootState } from '../../Store/Store';

const mapStateToProps = (state: RootState) => ({
  trailSettings: state.trailSettings,
});

const mapDispatchToProps = (dispatch) => ({
  setTrailVisibility: (visibility) => dispatch(setTrailVisibility(visibility)),
  setTrailLength: (length) => dispatch(setTrailLength(length)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

export const ClusterTrailSettings = connector(({ trailSettings, setTrailVisibility, setTrailLength }: Props) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch color="primary" checked={trailSettings.show} onChange={(_, newVal) => setTrailVisibility(newVal)} name="jason" />}
        label="Show Group Trail"
      />
      <Typography id="discrete-slider" gutterBottom>
        Trail Length
      </Typography>
      <Slider
        value={trailSettings.length}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={5}
        marks
        min={10}
        max={100}
        onChange={(_, newVal) => {
          setTrailLength(newVal);
        }}
      />
    </FormGroup>
  );
});
