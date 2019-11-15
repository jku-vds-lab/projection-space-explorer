/**
 * This script contains generic purpose functions that are used by the visualization, like the normalization of data points
 * and searching for the nearest neibour etc...
 */







function normalizeVectors(vectors, width, height) {
  var zoom = 10

  // Get rectangle that fits around data set
  var minX = 1000, maxX = -1000, minY = 1000, maxY = -1000;
  vectors.forEach (vector => {
    minX = Math.min(minX, vector.x)
    maxX = Math.max(maxX, vector.x)
    minY = Math.min(minY, vector.y)
    maxY = Math.max(maxY, vector.y)
  })

  // Get biggest scale
  var horizontal = Math.max(Math.abs(minX), Math.abs(maxX))
  var vertical = Math.max(Math.abs(minY), Math.abs(maxY))

  return Math.min(width, height) / Math.max(horizontal, vertical) / 2
}
