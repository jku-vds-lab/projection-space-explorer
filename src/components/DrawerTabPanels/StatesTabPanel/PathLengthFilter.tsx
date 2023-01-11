import * as React from 'react';
import { Typography, Slider } from '@mui/material';
import { connect } from 'react-redux';
import { setPathLengthRange } from '../../Ducks/PathLengthRange';

export function PathLengthFilterFull({ pathLengthRange, setPathLengthRange }) {
  if (pathLengthRange == null) {
    return <div />;
  }

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: pathLengthRange.maximum,
      label: `${pathLengthRange.maximum}`,
    },
  ];

  return (
    <div style={{ margin: '0 16px', padding: '0 8px' }}>
      <Typography id="range-slider" gutterBottom>
        Path length filter
      </Typography>
      <Slider
        min={0}
        max={pathLengthRange.maximum}
        value={pathLengthRange.range}
        onChange={(_, newValue) => {
          setPathLengthRange(newValue);
        }}
        marks={marks}
        valueLabelDisplay="auto"
      />
    </div>
  );
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  setPathLengthRange: (pathLengthRange) => dispatch(setPathLengthRange(pathLengthRange)),
});

export const PathLengthFilter = connect(mapStateToProps, mapDispatchToProps)(PathLengthFilterFull);
