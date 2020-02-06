var d3v5 = require('d3')
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

/**
 * Component that lets user pick from a list of color scales.
 */
export var ColorScaleSelect = ({ selectedScaleIndex, onChange, definedScales }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickListItem = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setAnchorEl(null);

    onChange(definedScales[index], index)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <List component="nav" aria-label="Device settings">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          onClick={handleClickListItem}
        >
          <ColorScaleMenuItem scale={definedScales[selectedScaleIndex]}></ColorScaleMenuItem>

        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {definedScales.map((scale, index) => (
          <MenuItem
            key={index}
            selected={index === selectedScaleIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            <ColorScaleMenuItem scale={scale}></ColorScaleMenuItem>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export var ColorScaleMenuItem = ({ scale }) => {
  if (scale.type == "continuous") {
    return <div style={{ width: '100%', minWidth: '15rem', height: '1rem', backgroundImage: `linear-gradient(to right, ${scale.stops.map(stop => stop.hex).join(',')})` }}>
    </div>
  } else {
    return <div style={{ width: '100%', minWidth: '15rem', height: '1rem', backgroundImage: `linear-gradient(to right, ${scale.stops.map((stop, index) => `${stop.hex} ${(index / scale.stops.length) * 100.0}%, ${stop.hex} ${((index + 1) / scale.stops.length) * 100.0}%`).join(',')})` }}>
    </div>
  }
}



export class QualitativeScaleMapping {
  constructor(scale, values) {
    this.scale = scale
    this.values = values
  }

  getMapping() {
    return this.values.reduce((map, value) => {
      map[value] = this.scale.map(this.values.indexOf(value))
      return map
    }, {})
  }

  map(value) {
    return this.scale.map(this.values.indexOf(value))
  }
}

export class SequentialScaleMapping {
  constructor(scale, range) {
    this.scale = scale
    this.range = range
  }

  map(value) {
    var normalized = (value - this.range.min) / (this.range.max - this.range.min)
    return this.scale.map(normalized)
  }
}





export class SchemeColor {
  constructor(hex) {
    this.hex = hex
    this.rgb = this.hexToRgb(this.hex)
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }



  static componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  static rgbToHex(r, g, b) {
    return new SchemeColor("#" + SchemeColor.componentToHex(r) + SchemeColor.componentToHex(g) + SchemeColor.componentToHex(b))
  }
}

export class ColorScheme {
  constructor(colors) {
    this.colors = colors
  }

  getMapping() {
    return this.mapping
  }

  createMapping(values) {

    var i = 0
    this.mapping = values.reduce((map, obj) => {
      map[obj] = this.colors[i]
      i++
      return map
    }, {})

    return new QualitativeScaleMapping(this, values)
  }

  map(value) {
    return this.colors[value]
  }
}



export class LinearColorScale {
  constructor(stops, type) {
    this.stops = stops
    this.type = type
    this.interpolator = d3v5.scaleLinear()
      .domain(this.stops.map((stop, index) => (1 / (this.stops.length - 1)) * index)).range(this.stops.map(stop => stop.hex))

  }

  createMapping(range) {
    if (this.type == "continuous") {
      return new SequentialScaleMapping(this, range)
    } else {
      return new QualitativeScaleMapping(this, range)
    }
  }
}

export class ContinuosScale extends LinearColorScale {
  constructor(stops) {
    super(stops, "continuous");
  }

  map(value) {
    var d3color = d3v5.color(this.interpolator(value))
    return SchemeColor.rgbToHex(d3color.r, d3color.g, d3color.b)
  }
}

export class DiscreteScale extends LinearColorScale {
  constructor(stops) {
    super(stops, "discrete")
  }

  map(value) {
    return this.stops[value]
  }
}

export class DiscreteMapping {
  constructor(scale, values) {
    this.scale = scale
    this.values = values
  }

  map(value) {
    return this.scale.map(this.values.indexOf(value) % this.values.length)
  }
}

export class ContinuousMapping {
  constructor(scale, range) {
    this.scale = scale
    this.range = range
  }

  map(value) {
    var normalized = (value - this.range.min) / (this.range.max - this.range.min)
    return this.scale.map(normalized)
  }
}


export class DefaultLineColorScheme extends ColorScheme {
  constructor() {
    super([
      new SchemeColor("#1b9e77"),
      new SchemeColor("#d95f02"),
      new SchemeColor("#7570b3"),
      new SchemeColor("#e7298a"),
      new SchemeColor("#66a61e"),
      new SchemeColor("#e6ab02"),
      new SchemeColor("#a6761d"),
      new SchemeColor("#666666")
    ])
  }
}

/**
 * Breaks an integer down into its r,g,b components.
 */
export function hexToRGB(color) {
  return {
    r: (color & 0xff0000) >> 16,
    g: (color & 0x00ff00) >> 8,
    b: (color & 0x0000ff)
  }
}









export function defaultScalesForAttribute(attribute) {
  if (attribute.type == 'categorical') {
    return [
      new DiscreteScale([
        new SchemeColor("#1b9e77"),
        new SchemeColor("#d95f02"),
        new SchemeColor("#7570b3"),
        new SchemeColor("#e7298a"),
        new SchemeColor("#66a61e"),
        new SchemeColor("#e6ab02"),
        new SchemeColor("#a6761d"),
        new SchemeColor("#666666")
      ]),
      new DiscreteScale([
        new SchemeColor("#a6cee3"),
        new SchemeColor("#1f78b4"),
        new SchemeColor("#b2df8a"),
        new SchemeColor("#33a02c"),
        new SchemeColor("#fb9a99"),
        new SchemeColor("#e31a1c"),
        new SchemeColor("#fdbf6f"),
        new SchemeColor("#ff7f00")
      ])
    ]
  } else {
    return [
      new ContinuosScale([
        new SchemeColor('#fdcc8a'),
        new SchemeColor('#b30000')
      ]),
      new ContinuosScale([
        new SchemeColor('#a6611a'),
        new SchemeColor('#f5f5f5'),
        new SchemeColor('#018571')
      ]),
      new ContinuosScale([
        new SchemeColor('#ca0020'),
        new SchemeColor('#f7f7f7'),
        new SchemeColor('#0571b0')
      ])

    ]
  }

}