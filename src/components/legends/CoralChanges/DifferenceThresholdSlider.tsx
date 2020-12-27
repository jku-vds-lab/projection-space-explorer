import React = require("react");
import { Typography, Slider } from "@material-ui/core";
import { connect } from 'react-redux'
import { setDifferenceThreshold } from "../../Ducks/DifferenceThresholdDuck";

const [value, setValue] = React.useState([0.0, 1.0]);

const handleChange = (event, newValue) => {
  setValue(newValue);
};

const DifferenceThresholdSliderFull = ({ differenceThreshold, setDifferenceThreshold }) => {
  return <div style={{ margin: '0 16px', padding: '0 8px' }}>
        <Typography id="range-slider" gutterBottom>
            Difference Threshold
      </Typography>
        <Slider
            min={0.01}
            max={1}
            step={0.01}
            value={differenceThreshold}
            onChange={handleChange}
            onChangeCommitted={(_, newValue) => {
              setDifferenceThreshold(newValue)
            }}
            valueLabelDisplay="auto"
        ></Slider>
    </div>
}

const mapStateToProps = state => ({
  differenceThreshold: state.differenceThreshold
})

const mapDispatchToProps = dispatch => ({
  setDifferenceThreshold: differenceThreshold => dispatch(setDifferenceThreshold(differenceThreshold))
})

export const DifferenceThresholdSlider = connect(mapStateToProps, mapDispatchToProps)(DifferenceThresholdSliderFull)

// export default class ThresholdSlider extends React.Component {
//   state = {
//     value: 0.25
//   }

//   handleOnChange = (e) => this.setState({ value: e.target.value })

//   render() {
//     return (
//       <div id="thresholdSlider" className="vega-bind">
//         <label>
//           <span className="vega-bind-name">dif</span>
//           <input type="range" name="threshold_abs" min={0.01} max={1} step={0.01} value={this.state.value} onChange={this.handleOnChange} />
//           <span className="value">{this.state.value}</span>
//         </label>
//       </div>
//     )
//   }
// }
