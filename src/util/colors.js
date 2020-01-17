var d3v5 = require('d3')


export class QualitativeScaleMapping {
  constructor(scale, values) {
    this.scale = scale
    this.values = values
  }

  getMapping() {
    return this.values.reduce((map, value) => {
      map[value] = this.scale.map(value)
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

export class SequentialColorScheme {
  constructor() {
    this.interpolator = d3v5.interpolateRgb("red", "blue")
  }

  createMapping(range) {
    return new SequentialScaleMapping(this, range)
  }

  map(value) {
    var d3color = d3v5.color(this.interpolator(value))
    return SchemeColor.rgbToHex(d3color.r, d3color.g, d3color.b)
  }
}

export class DivergingColorScheme {
  constructor() {
  }

  createMapping(range) {
    return new SequentialScaleMapping(this, range)
  }

  map(value) {
    var d3color = d3v5.color(d3v5.interpolatePRGn(value))
    return SchemeColor.rgbToHex(d3color.r, d3color.g, d3color.b)
  }
}

export class TableuVectorColorScheme extends ColorScheme {
  constructor() {
    super([
      new SchemeColor("#a6cee3"),
      new SchemeColor("#1f78b4"),
      new SchemeColor("#b2df8a"),
      new SchemeColor("#33a02c"),
      new SchemeColor("#fb9a99"),
      new SchemeColor("#e31a1c"),
      new SchemeColor("#fdbf6f")
    ])
  }
}

export class DefaultVectorColorScheme extends ColorScheme {
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
