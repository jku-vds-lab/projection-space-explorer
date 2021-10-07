import React = require("react");
import { Typography, Slider } from "@material-ui/core";
import { connect } from 'react-redux'
import { setPathLengthRange } from "../../Ducks/PathLengthRange";

export var PathLengthFilterFull = ({ pathLengthRange, setPathLengthRange }) => {
    if (pathLengthRange == null) {
        return <div></div>
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

    return <div style={{ margin: '0 16px', padding: '0 8px' }}>
        <Typography id="range-slider" gutterBottom>
            Path Length Filter
      </Typography>
        <Slider
            min={0}
            max={pathLengthRange.maximum}
            value={pathLengthRange.range}
            onChange={(_, newValue) => {
                setPathLengthRange(newValue)
            }}
            marks={marks}
            valueLabelDisplay="auto"
        ></Slider>
    </div>
}

const mapStateToProps = state => ({
    pathLengthRange: state.pathLengthRange
})

const mapDispatchToProps = dispatch => ({
    setPathLengthRange: pathLengthRange => dispatch(setPathLengthRange(pathLengthRange))
})

export const PathLengthFilter = connect(mapStateToProps, mapDispatchToProps)(PathLengthFilterFull)