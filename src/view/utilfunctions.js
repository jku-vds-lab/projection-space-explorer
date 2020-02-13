/**
 * Calculates the default zoom factor by examining the bounds of the data set
 * and then dividing it by the height of the viewport.
 */
export function getDefaultZoom(vectors, width, height) {
  var zoom = 10

  // Get rectangle that fits around data set
  var minX = 1000, maxX = -1000, minY = 1000, maxY = -1000;
  vectors.forEach(vector => {
    minX = Math.min(minX, vector.x)
    maxX = Math.max(maxX, vector.x)
    minY = Math.min(minY, vector.y)
    maxY = Math.max(maxY, vector.y)
  })

  // Get biggest scale
  var horizontal = Math.max(Math.abs(minX), Math.abs(maxX))
  var vertical = Math.max(Math.abs(minY), Math.abs(maxY))

  // Divide the height/width through the biggest axis of the data points
  return Math.min(width, height) / Math.max(horizontal, vertical) / 2
}



export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}


/**
 * Checks if 2 dictionaries are equal
 * @param {*} a 
 * @param {*} b 
 */
export function dictEqual(a, b) {
  var res = true
  Object.keys(a).forEach(aKey => {
    if (a[aKey] != b[aKey]) {
      res = false

    }
  })
  return res
}


