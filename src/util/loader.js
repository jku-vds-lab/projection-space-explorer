/**
 * Data loading routines.
 */
var d3v5 = require('d3')






function getSegments(data) {
  //creating an array holding arrays of x,y,cubenum,algo,age for each cube

  // Sort data by cubeNum
  data.sort((a, b) => a.cubeNum - b.cubeNum)


  var n = data.length
  var points = new Array()
  var currentCube = 0
  var newArray = { vectors: new Array(), algo: data[0].algo }
  for (var i = 0; i < n; i++) {
    if (data[i].cubeNum != currentCube) {
      points.push(newArray)
      currentCube = data[i].cubeNum

      newArray = { vectors: new Array(), algo: data[i].algo }
    }

    newArray.vectors.push(data[i])
  }
  points.push(newArray)
  return points
}





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
function loadSet(file, algorithms, chooseColor, callback) {
  d3v5.csv(file).then(function(data) {
    var header = Object.keys(data[0])

    // If data contains no x and y attributes, its invalid
    if ("x" in header && "y" in header) {
      data.forEach(vector => {
        vector.x = +vector.x.trim()
        vector.y = +vector.y.trim()
      })
    } else {
      throw Exception("Need at least x and y")
    }

    // If data contains no line attribute, add one
    if (!("line" in header)) {
      data.forEach(vector => {
        vector.line = 1
      })
    }


    data.forEach(function(d) { // convert strings to numbers
      if ("cubeNum" in d) {
        d.cubeNum = +d.cubeNum
      }
      if ("ep" in d) {
        d.cubeNum = +d.ep
      }


      if ("cp" in d) {
        d.cp = d.cp
      }

      if ("algo" in d) {
        d.algo = +d.algo
      } else {
        d.algo = "all"
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

    callback(data)
  })
}


module.exports = {
  load: loadSet,
  getSegments: getSegments
}
