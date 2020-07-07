export function isPointInConvaveHull(seat, points) {
    if (points.length <= 1) {
        return false;
    }

    var selected = false

    var intercessionCount = 0;
    for (var index = 1; index < points.length; index++) {
        var start = points[index - 1];
        var end = points[index];

        //Testes

        //*************************************************
        //* Adicionar teste bounding box intersection aqui *
        //*************************************************

        var ray = { Start: { x: seat.x, y: seat.y }, End: { x: 99999, y: 0 } };
        var segment = { Start: start, End: end };
        var rayDistance = {
            x: ray.End.x - ray.Start.x,
            y: ray.End.y - ray.Start.y
        };
        var segDistance = {
            x: segment.End.x - segment.Start.x,
            y: segment.End.y - segment.Start.y
        };

        var rayLength = Math.sqrt(Math.pow(rayDistance.x, 2) + Math.pow(rayDistance.y, 2));
        var segLength = Math.sqrt(Math.pow(segDistance.x, 2) + Math.pow(segDistance.y, 2));

        if ((rayDistance.x / rayLength == segDistance.x / segLength) &&
            (rayDistance.y / rayLength == segDistance.y / segLength)) {
            continue;
        }

        var T2 = (rayDistance.x * (segment.Start.y - ray.Start.y) + rayDistance.y * (ray.Start.x - segment.Start.x)) / (segDistance.x * rayDistance.y - segDistance.y * rayDistance.x);
        var T1 = (segment.Start.x + segDistance.x * T2 - ray.Start.x) / rayDistance.x;

        //Parametric check.
        if (T1 < 0) {
            continue;
        }
        if (T2 < 0 || T2 > 1) {
            continue
        };
        if (isNaN(T1)) {
            continue
        }; //rayDistance.X = 0

        intercessionCount++;
    }

    if (intercessionCount == 0) {
        selected = false;
        return selected;
    }
    if (intercessionCount & 1) {
        selected = true;
    } else {
        selected = false;
    }


    return selected
}