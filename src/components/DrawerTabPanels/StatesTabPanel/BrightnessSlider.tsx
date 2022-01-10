import React = require("react");
import { Typography, Slider } from "@mui/material";
import { connect } from 'react-redux'
import { RootState } from "../../Store/Store";
import { setGlobalPointBrightness } from "../../Ducks/GlobalPointBrightnessDuck";
import { makeStyles } from "@mui/styles";


const useStyles = makeStyles(theme => ({
    root: {
        margin: '0px 16px',
        padding: '0px 8px'
    },
}));


const BrightnessSliderFull = ({ brightnessScale, setRange }) => {

    const classes = useStyles()

    const marks = [
        {
            value: 0,
            label: '0%',
        },
        {
            value: 0.25,
            label: `25%`,
        },
        {
            value: 0.5,
            label: `50%`,
        },
        {
            value: 0.75,
            label: `75%`,
        },
        {
            value: 1,
            label: `100%`,
        }
    ];

    return <div className={classes.root}>
        <Typography id="range-slider" gutterBottom>
            Opacity Scale
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