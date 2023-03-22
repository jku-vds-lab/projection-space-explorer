import * as React from 'react';
import { Typography, Slider, Box } from '@mui/material';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { setGlobalPointBrightness } from '../../Ducks/GlobalPointBrightnessDuck';

const useStyles = makeStyles(() => ({
  root: {
    margin: '0px 16px',
    padding: '0px 8px',
  },
}));

function BrightnessSliderFull({ globalPointBrightness, setRange }) {
  const classes = useStyles();

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 0.25,
      label: `0.25`,
    },
    {
      value: 0.5,
      label: `0.5`,
    },
    {
      value: 0.75,
      label: `0.75`,
    },
    {
      value: 1,
      label: `1`,
    },
  ];

  return (
    <Box className={classes.root}>
      <Typography id="range-slider" variant="body2" color="textSecondary">
        Opacity scale
      </Typography>
      <Slider min={0} max={1} value={globalPointBrightness} onChange={(_, newValue) => setRange(newValue)} step={0.05} marks={marks} valueLabelDisplay="auto" />
    </Box>
  );
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  setRange: (value) => dispatch(setGlobalPointBrightness(value)),
});

export const BrightnessSlider = connect(mapStateToProps, mapDispatchToProps)(BrightnessSliderFull);
