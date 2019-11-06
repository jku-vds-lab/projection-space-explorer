class Problem {
  constructor(type) {
    this.type = type
  }

  aggregate(vectors) {
    if (this.type == ProblemType.CHESS) {
      return aggregateChess(vectors)
    }
    if (this.type == ProblemType.RUBIK) {
      return aggregateRubik(vectors)
    }
  }
}


const ProblemType = Object.freeze({
  "CHESS" : 1,
  "RUBIK" : 2
})
