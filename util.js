class Problem {
  constructor(type) {
    this.type = type
  }

  aggregate(vectors) {
    setAggregateView(document.getElementById('aggregate'), vectors)
  }
}


const ProblemType = Object.freeze({
  "CHESS" : 1,
  "RUBIK" : 2
})
