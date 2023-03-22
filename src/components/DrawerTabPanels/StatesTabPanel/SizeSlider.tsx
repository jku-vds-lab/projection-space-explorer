import * as React from 'react';
import { Typography, Slider } from '@mui/material';
import { connect } from 'react-redux';
import { setGlobalPointSize } from '../../Ducks/GlobalPointSizeDuck';

export const SizeSliderMarks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 1,
    label: `1`,
  },
  {
    value: 2,
    label: `2`,
  },
  {
    value: 3,
    label: `3`,
  },
  {
    value: 4,
    label: `4`,
  },
  {
    value: 5,
    label: `5`,
  },
];

function SizeSliderFull({ globalPointSize, setRange }) {
  return (
    <div
      style={{
        margin: '0px 16px',
        padding: '0px 8px',
      }}
    >
      <Typography id="range-slider" variant="body2" color="textSecondary">
        Size scale
      </Typography>

      <Slider
        min={0}
        max={5}
        value={globalPointSize}
        onChange={(_, newValue) => setRange(newValue)}
        step={0.25}
        marks={SizeSliderMarks}
        valueLabelDisplay="auto"
      />
    </div>
  );
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  setRange: (value) => dispatch(setGlobalPointSize(value)),
});

export const SizeSlider = connect(mapStateToProps, mapDispatchToProps)(SizeSliderFull);
