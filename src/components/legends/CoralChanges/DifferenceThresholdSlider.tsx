import React = require("react");
import { Typography, Slider } from "@material-ui/core";
import { connect } from 'react-redux'
import { setDifferenceThreshold, setOldDifferenceThreshold } from "../../Ducks/DifferenceThresholdDuck";

const DifferenceThresholdSliderFull = ({ oldDifferenceThreshold, differenceThreshold, setOldDifferenceThreshold, setDifferenceThreshold }) => {
  return <div style={{ margin: '0 16px', padding: '0 8px' }}>
        <Typography id="range-slider" gutterBottom align="center">
            Threshold 3
      </Typography>
        <Slider
            min={0.01}
            max={1}
            step={0.01}
            value={oldDifferenceThreshold}
            onChange={(_, newValue) => {
              setOldDifferenceThreshold(newValue)
            }}
            onChangeCommitted={(_, newValue) => {
              setDifferenceThreshold(newValue)
            }}
            valueLabelDisplay="auto"
        ></Slider>
    </div>
}

const mapStateToProps = state => ({
  differenceThreshold: state.differenceThreshold,
  oldDifferenceThreshold: state.oldDifferenceThreshold
})

const mapDispatchToProps = dispatch => ({
  setDifferenceThreshold: differenceThreshold => dispatch(setDifferenceThreshold(differenceThreshold)),
  setOldDifferenceThreshold: oldDifferenceThreshold => dispatch(setOldDifferenceThreshold(oldDifferenceThreshold))
})

export const DifferenceThresholdSlider = connect(mapStateToProps, mapDispatchToProps)(DifferenceThresholdSliderFull)