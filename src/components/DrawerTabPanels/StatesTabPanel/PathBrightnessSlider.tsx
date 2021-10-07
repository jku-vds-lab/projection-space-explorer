import React = require("react");
import { Typography, Slider } from "@material-ui/core";
import { connect } from 'react-redux'
import { setLineBrightness } from "../../Ducks/LineBrightnessDuck";

const PathBrightnessSliderFull = ({ lineBrightness, setLineBrightness }) => {
    const marks = [
        {
            value: 0,
            label: "0%",
        },
        {
            value: 50,
            label: "50%",
        },
        {
            value: 100,
            label: "100%",
        },
    ];

    return <div style={{ margin: '0 16px', padding: '0 8px' }}>
        <Typography id="range-slider" gutterBottom>
            Line Opacity
      </Typography>
        <Slider
            min={0}
            max={100}
            step={5}
            value={lineBrightness}
            onChange={(_, newValue) => {
                setLineBrightness(newValue)
            }}
            marks={marks}
            valueLabelDisplay="auto"
        ></Slider>
    </div>
}

const mapStateToProps = state => ({
    lineBrightness: state.lineBrightness
})

const mapDispatchToProps = dispatch => ({
    setLineBrightness: lineBrightness => dispatch(setLineBrightness(lineBrightness))
})

export const PathBrightnessSlider = connect(mapStateToProps, mapDispatchToProps)(PathBrightnessSliderFull)

