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
    yield 0x148F77 // Elf green
    yield 0x7D3C98 // Vivid violet
    yield 0xFFC300 // Yellow
    yield 0xff5733 // Orange
    yield 0x95A5A6 // Gray
    yield 0x581845
    yield 0x00fff0
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
