/**
 * Data loading routines.
 */




class Vector {
  constructor() {
  }
}

/**
 * Loads a set with given filename.
 *
 * @param file the path of the file to load.
 * @param type the type of the problem, eg ProblemType.CHESS or ProblemType.RUBIK.
 *
 */
function loadSet(file, type, callback) {
  d3.csv(file, function loadCallback(error, data) {
    data.forEach(function(d) { // convert strings to numbers
      // Convert generic attributes
      d.y = +d.y
      d.x = +d.x

      if ("cubeNum" in d) {
        d.cubeNum = +d.cubeNum
      }
      if ("ep" in d) {
        d.cubeNum = +d.ep
      }


      if ("cp" in d) {
        d.cp = +d.cp
      }

      if ("algo" in d) {
        d.algo = +d.algo
      }

      if ("age" in d) {
        d.age = +d.age
      }

      // Attribute that specifies if this vector should be visible or not
      d.visible = true

      if (!(d.algo in algorithms)) {
        algorithms[d.algo] = {
          color: chooseColor.next().value
        }
      }
    })

    console.log(data)

    callback(data)
  })
}
