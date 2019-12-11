/**
 * Defines a generator which returns the colors used for the lines displayed.
 */
function * colorGenerator() {
  while (true) {
    yield 0x2d7864 // Elf green
    yield 0x943b80 // Vivid violet
    yield 0xff6600 // Yellow
    yield 0x0084c8 // Orange
    yield 0xb88100 // Gray
    yield 0xdc0000
    yield 0x364e59
  }
}

/**
 * Breaks an integer down into its r,g,b components.
 */
function hexToRGB(color) {
  return {
    r: (color & 0xff0000) >> 16,
    g: (color & 0x00ff00) >> 8,
    b: (color & 0x0000ff)
  }
}

module.exports = {
  generator: colorGenerator,
  hexToRGB: hexToRGB
}
