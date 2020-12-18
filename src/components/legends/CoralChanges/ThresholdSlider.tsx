import * as React from 'react'

export default class ThresholdSlider extends React.Component {
  state = {
    value: 0.25
  }

  handleOnChange = (e) => this.setState({ value: e.target.value })

  render() {
    return (
      <div id="thresholdSlider" className="vega-bind">
        <label>
          <span className="vega-bind-name">dif</span>
          <input type="range" name="threshold_abs" min={0.01} max={1} step={0.01} value={this.state.value} onChange={this.handleOnChange} />
          <span className="value">{this.state.value}</span>
        </label>
      </div>
    )
  }
}
