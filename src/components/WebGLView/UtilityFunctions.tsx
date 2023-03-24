import { ADataset, Dataset, IBaseProjection } from '../../model';

/**
 * Calculates the default zoom factor by examining the bounds of the data set
 * and then dividing it by the height of the viewport.
 */
export function getDefaultZoom(dataset: Dataset, width, height, xChannel: string, yChannel: string, workspace: IBaseProjection) {
  // Get rectangle that fits around data set
  let minX = 1000;
  let maxX = -1000;
  let minY = 1000;
  let maxY = -1000;

  const spatial = ADataset.getSpatialData(dataset, xChannel, yChannel, workspace);

  spatial.forEach((s) => {
    minX = Math.min(minX, s.x);
    maxX = Math.max(maxX, s.x);
    minY = Math.min(minY, s.y);
    maxY = Math.max(maxY, s.y);
  });

  const x = (maxX + minX) / 2;
  const y = (maxY + minY) / 2;

  // Get biggest scale
  const maxAbsX = Math.abs(maxX - x);
  const maxAbsY = Math.abs(maxY - y);

  const horizontal = width / maxAbsX;
  const vertical = height / maxAbsY;

  return { zoom: Math.min(horizontal / 2, vertical / 2), x, y };
}

export function interpolateLinear(min, max, k) {
  return min + (max - min) * k;
}

export function centerOfMass(points) {
  let x = 0;
  let y = 0;

  points.forEach((p) => {
    x += p.x;
    y += p.y;
  });

  return {
    x: x / points.length,
    y: y / points.length,
  };
}

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (let i = 0; i < a.length; ++i) {
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
  let res = true;
  Object.keys(a).forEach((aKey) => {
    if (a[aKey] !== b[aKey]) {
      res = false;
    }
  });
  return res;
}

export function normalizeWheel(/* object */ event) /* object */ {
  // Reasonable defaults
  const PIXEL_STEP = 10;
  const LINE_HEIGHT = 40;
  const PAGE_HEIGHT = 800;

  let sX = 0;
  let sY = 0; // spinX, spinY
  let pX = 0;
  let pY = 0; // pixelX, pixelY

  // Legacy
  if ('detail' in event) {
    sY = event.detail;
  }
  if ('wheelDelta' in event) {
    sY = -event.wheelDelta / 120;
  }
  if ('wheelDeltaY' in event) {
    sY = -event.wheelDeltaY / 120;
  }
  if ('wheelDeltaX' in event) {
    sX = -event.wheelDeltaX / 120;
  }

  // side scrolling on FF with DOMMouseScroll
  if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
    sX = sY;
    sY = 0;
  }

  pX = sX * PIXEL_STEP;
  pY = sY * PIXEL_STEP;

  if ('deltaY' in event) {
    pY = event.deltaY;
  }
  if ('deltaX' in event) {
    pX = event.deltaX;
  }

  if ((pX || pY) && event.deltaMode) {
    if (event.deltaMode === 1) {
      // delta in LINE units
      pX *= LINE_HEIGHT;
      pY *= LINE_HEIGHT;
    } else {
      // delta in PAGE units
      pX *= PAGE_HEIGHT;
      pY *= PAGE_HEIGHT;
    }
  }

  // Fall-back if spin cannot be determined
  if (pX && !sX) {
    sX = pX < 1 ? -1 : 1;
  }
  if (pY && !sY) {
    sY = pY < 1 ? -1 : 1;
  }

  return {
    spinX: sX,
    spinY: sY,
    pixelX: pX,
    pixelY: pY,
  };
}

export function valueInRange(value, range) {
  if (range == null) return true;
  return value >= range[0] && value <= range[1];
}

export function getMinMaxOfChannel(dataset: Dataset, key: string, segment?) {
  let min = null;
  let max = null;
  let center = null;

  if (dataset.columns[key].range) {
    min = dataset.columns[key].range.min;
    max = dataset.columns[key].range.max;
    center = dataset.columns[key].range.center;
  } else if (dataset.isSequential && segment) {
    const filtered = segment.vectors.map((vector) => vector[key]);
    max = Math.max(...filtered);
    min = Math.min(...filtered);
    center = (min + max) / 2;
  } else {
    const filtered = dataset.vectors.map((vector) => vector[key]);
    max = Math.max(...filtered);
    min = Math.min(...filtered);
    center = (min + max) / 2;
  }

  return { min, max, center };
}

export function highlightElement(element: Element) {
  const keyframes = [{ background: '#007dad' }, { background: 'white' }];

  const timing = {
    duration: 2000,
    iterations: 1,
  };

  element.animate(keyframes, timing);
}

/**
 * Highlights the nth tab in the tab bar
 */
export function highlightTab(n: number) {
  // Select the nth tab in the tab container
  const tabRootcontainer = document.getElementById('tabs-container').querySelector('div').querySelector('div');
  const nth = tabRootcontainer.querySelector(`button:nth-child(${n})`);

  highlightElement(nth);
}

export function highlightGutter() {
  highlightElement(document.querySelector('.gutter'));
}
