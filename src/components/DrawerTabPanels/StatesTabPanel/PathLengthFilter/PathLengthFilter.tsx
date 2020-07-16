import React = require("react");
import { Typography, Slider } from "@material-ui/core";


export var PathLengthFilter = ({ pathLengthRange, onChange, maxPathLength }) => {
    if (pathLengthRange == null) {
        return <div></div>
    }

    const marks = [
        {
            value: 0,
            label: '0',
        },
        {
            value: maxPathLength,
            label: `${maxPathLength}`,
        },
    ];

    return <div style={{ margin: '0 16px', padding: '0 8px' }}>
        <Typography id="range-slider" gutterBottom>
            Path Length Filter
      </Typography>
        <Slider
            min={0}
            max={maxPathLength}
            value={pathLengthRange}
            onChange={onChange}
            marks={marks}
            valueLabelDisplay="auto"
        ></Slider>
    </div>
}