export function pointInHull(seat: { x: number; y: number }, points) {
  if (points.length <= 1) {
    return false;
  }

  let selected = false;

  let intercessionCount = 0;
  for (let index = 1; index < points.length; index++) {
    const start = points[index - 1];
    const end = points[index];

    // Testes

    //* ************************************************
    //* Adicionar teste bounding box intersection aqui *
    //* ************************************************

    const ray = { Start: { x: seat.x, y: seat.y }, End: { x: 99999, y: 0 } };
    const segment = { Start: start, End: end };
    const rayDistance = {
      x: ray.End.x - ray.Start.x,
      y: ray.End.y - ray.Start.y,
    };
    const segDistance = {
      x: segment.End.x - segment.Start.x,
      y: segment.End.y - segment.Start.y,
    };

    const rayLength = Math.sqrt(rayDistance.x ** 2 + rayDistance.y ** 2);
    const segLength = Math.sqrt(segDistance.x ** 2 + segDistance.y ** 2);

    if (rayDistance.x / rayLength === segDistance.x / segLength && rayDistance.y / rayLength === segDistance.y / segLength) {
      continue;
    }

    const T2 =
      (rayDistance.x * (segment.Start.y - ray.Start.y) + rayDistance.y * (ray.Start.x - segment.Start.x)) /
      (segDistance.x * rayDistance.y - segDistance.y * rayDistance.x);
    const T1 = (segment.Start.x + segDistance.x * T2 - ray.Start.x) / rayDistance.x;

    // Parametric check.
    if (T1 < 0) {
      continue;
    }
    if (T2 < 0 || T2 > 1) {
      continue;
    }
    if (Number.isNaN(T1)) {
      continue;
    } // rayDistance.X = 0

    intercessionCount++;
  }

  if (intercessionCount === 0) {
    selected = false;
    return selected;
  }
  if (intercessionCount & 1) {
    selected = true;
  } else {
    selected = false;
  }

  return selected;
}
