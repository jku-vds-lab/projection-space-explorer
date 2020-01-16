/**
 * Data loading routines.
 */
var d3v5 = require('d3')



const DEFAULT_LINE = "L"
const DEFAULT_ALGO = "all"


function getSegs(vectors) {
  // Sort vectors by line, and then by age
  vectors.sort((a, b) => {
    if (a == b) {
      return b.age - a.age
    } else {
      return a.line.toString().localeCompare(b.line.toString())
    }
  })

  var lineKeys = [ ... new Set(vectors.map(vector => vector.line)) ]
  
  var segments = lineKeys.map(lineKey => {
    return { vectors: vectors.filter(vector => vector.line == lineKey) }
  })

  return segments
}

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
function loadSet(file, callback) {
  d3v5.csv(file).then(function(data) {
    var header = Object.keys(data[0])

    // If data contains no x and y attributes, its invalid
    if (header.includes("x") && header.includes("y")) {
      data.forEach(vector => {
        vector.x = +vector.x
        vector.y = +vector.y
      })
    } else {
      
    }

    // If data contains no line attribute, add one
    if (!header.includes("line")) {
      // Add age attribute as index and line as DEFAULT_LINE
      data.forEach((vector, index) => {
        vector.line = DEFAULT_LINE
        if (!header.includes("age")) {
          vector.age = index
        }
      })
    } else if (header.includes("line") && !header.includes("age")) {
      var segs = {}
      var distinct = [ ... new Set(data.map(vector => vector.line)) ]
      distinct.forEach(a => segs[a] = 0)
      data.forEach(vector => {
        vector.age = segs[vector.line]
        segs[vector.line] = segs[vector.line] + 1
      })
    }

    // If data has no algo attribute, add DEFAULT_ALGO
    if (!header.includes("algo")) {
      data.forEach(vector => {
        vector.algo = DEFAULT_ALGO
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

      if ("age" in d) {
        d.age = +d.age
      }

      // Attribute that specifies if this vector should be visible or not
      d.visible = true
    })

    callback(data)
  })
}


module.exports = {
  load: loadSet,
  getSegments: getSegs
}
