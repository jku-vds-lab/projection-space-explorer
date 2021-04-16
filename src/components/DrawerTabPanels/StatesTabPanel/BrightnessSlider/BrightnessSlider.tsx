import React = require("react");
import { Typography, Slider } from "@material-ui/core";
import './BrightnessSlider.scss'
import { connect } from 'react-redux'
import { RootState } from "../../../Store/Store";
import { setGlobalPointBrightness } from "../../../Ducks/GlobalPointBrightnessDuck";

const BrightnessSliderFull = ({ brightnessScale, setRange }) => {
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
        }
    ];

    return <div className="BrightnessSliderParent">
        <Typography id="range-slider" gutterBottom>
            Brightness Scale
      </Typography>
        <Slider
            min={0}
            max={1}
            value={brightnessScale}
            onChange={(_, newValue) => setRange(newValue)}
            step={0.05}
            marks={marks}
            valueLabelDisplay="auto"
        ></Slider>
    </div>
}

const mapStateToProps = (state: RootState) => ({
    brightnessScale: state.globalPointBrightness
})

const mapDispatchToProps = dispatch => ({
    setRange: value => dispatch(setGlobalPointBrightness(value))
})

export const BrightnessSlider = connect(mapStateToProps, mapDispatchToProps)(BrightnessSliderFull)