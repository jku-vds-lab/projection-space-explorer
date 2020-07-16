import React = require("react");
import { Typography, Slider } from "@material-ui/core";
import './SizeSlider.scss'

export var SizeSlider = ({ sizeScale, onChange }) => {
    const marks = [
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

    return <div className="SizeSliderParent">
        <Typography id="range-slider" gutterBottom>
            Size Scale
      </Typography>
        <Slider
            min={0}
            max={5}
            value={sizeScale}
            onChange={onChange}
            step={0.25}
            marks={marks}
            valueLabelDisplay="auto"
        ></Slider>
    </div>
}