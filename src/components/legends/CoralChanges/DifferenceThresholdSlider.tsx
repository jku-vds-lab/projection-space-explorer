import React = require("react");
import { Typography, Slider } from "@material-ui/core";
import { connect, ConnectedProps } from 'react-redux'
import { setDifferenceThreshold } from "../../Ducks/DifferenceThresholdDuck";

class simpleSlider extends React.Component<Props> {
  state = {
    value: 0.25,
  };

  constructor(props) {
    super(props)
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  componentDidUpdate(prevProps) {
    if ((this.props.differenceThreshold !== prevProps.differenceThreshold) && this.props.differenceThreshold) {
      setDifferenceThreshold(this.props.differenceThreshold)
      const value = this.props.differenceThreshold
      this.setState({ value })
      this.render()
    }
}

  render() {
    const { differenceThreshold, setDifferenceThreshold } = this.props
    const { value } = this.state;

    return (
      <div style={{ margin: '0 16px', padding: '0 8px' }}>
        <Typography id="range-slider" align="center">Filter Threshold</Typography>
        <Slider
          value={value}
          min={0.01}
          max={1}
          step={0.01}
          aria-labelledby="label"
          onChange={this.handleChange}
          onChangeCommitted={(_, newValue) => {
            setDifferenceThreshold(newValue)
          }}
        />
        <Typography align="center">{ value.toFixed(2) }</Typography>
      </div>
    );
  }
}

type Props = ConnectedProps<typeof connector>

const mapStateToProps = state => ({
  differenceThreshold: state.differenceThreshold
})

const mapDispatchToProps = dispatch => ({
  setDifferenceThreshold: differenceThreshold => dispatch(setDifferenceThreshold(differenceThreshold))
})

const connector = connect(mapStateToProps, mapDispatchToProps);

export const DifferenceThresholdSlider = connector(simpleSlider) 
