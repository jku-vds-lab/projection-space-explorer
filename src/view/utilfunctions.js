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






/**
 * Calculates the default zoom factor by examining the bounds of the data set
 * and then dividing it by the height of the viewport.
 */
export function generateZoomForSet(vectors, width, height) {
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
  var horizontal = maxX - minX
  var vertical = maxY - minY

  // Divide the height/width through the biggest axis of the data points
  return Math.min(width, height) / Math.max(horizontal, vertical) / 2
}









export function interpolateLinear(min, max, k) {
  return min + (max - min) * k
}

export function centerOfMass(points) {
  var x = 0
  var y = 0

  points.forEach(p => {
    x = x + p.x
    y = y + p.y
  })

  return {
    x: x / points.length,
    y: y / points.length
  }
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


export function normalizeWheel(/*object*/ event) /*object*/ {
  // Reasonable defaults
  var PIXEL_STEP = 10;
  var LINE_HEIGHT = 40;
  var PAGE_HEIGHT = 800;

  var sX = 0, sY = 0,       // spinX, spinY
    pX = 0, pY = 0;       // pixelX, pixelY

  // Legacy
  if ('detail' in event) { sY = event.detail; }
  if ('wheelDelta' in event) { sY = -event.wheelDelta / 120; }
  if ('wheelDeltaY' in event) { sY = -event.wheelDeltaY / 120; }
  if ('wheelDeltaX' in event) { sX = -event.wheelDeltaX / 120; }

  // side scrolling on FF with DOMMouseScroll
  if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
    sX = sY;
    sY = 0;
  }

  pX = sX * PIXEL_STEP;
  pY = sY * PIXEL_STEP;

  if ('deltaY' in event) { pY = event.deltaY; }
  if ('deltaX' in event) { pX = event.deltaX; }

  if ((pX || pY) && event.deltaMode) {
    if (event.deltaMode == 1) {          // delta in LINE units
      pX *= LINE_HEIGHT;
      pY *= LINE_HEIGHT;
    } else {                             // delta in PAGE units
      pX *= PAGE_HEIGHT;
      pY *= PAGE_HEIGHT;
    }
  }

  // Fall-back if spin cannot be determined
  if (pX && !sX) { sX = (pX < 1) ? -1 : 1; }
  if (pY && !sY) { sY = (pY < 1) ? -1 : 1; }

  return {
    spinX: sX,
    spinY: sY,
    pixelX: pX,
    pixelY: pY
  };
}






export function valueInRange(value, range) {
  if (range == null) return true
  return value >= range[0] && value <= range[1]
}