function intToComponents(colorBeginner) {
    var compBeginner = {
      r: (colorBeginner & 0xff0000) >> 16,
      g: (colorBeginner & 0x00ff00) >> 8,
      b: (colorBeginner & 0x0000ff)
    };

    return compBeginner
}

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



class Problem {
  constructor(type) {
    this.type = type
  }

  aggregate(vectors) {
    setAggregateView(document.getElementById('aggregate'), vectors, true)
  }
}


const ProblemType = Object.freeze({
  "CHESS" : 1,
  "RUBIK" : 2
})
