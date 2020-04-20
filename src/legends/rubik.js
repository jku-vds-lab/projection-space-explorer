var d3 = require('d3')

// method to convert cube.csv data to colours
function cubieToColour(str) {
    switch (str) {
        case "O": return "rgb(255,137,33)";
        case "Y": return "rgb(255,204,0)";
        case "G": return "rgb(48,174,32)";
        case "B": return "rgb(21,130,174)";
        case "R": return "rgb(197,11,11)";
        case "W": return "rgb(191,191,191)";
        default: return "black";
    }
}

/**
 * Aggregates vectors of rubik data and returns a representation of it.
 */
function aggregateRubik(vectors) {
    var ttCubieSize = 1.125;
    var ttCubieMargin = 0.0625;
    var distance = 3 * ttCubieSize + 3 * ttCubieMargin;

    var offsetMap = {
        "upXOffset": distance,
        "upYOffset": distance,
        "frontXOffset": distance,
        "frontYOffset": 2 * distance,
        "leftXOffset": 0,
        "leftYOffset": distance,
        "rightXOffset": 2 * distance,
        "rightYOffset": distance,
        "downXOffset": distance,
        "downYOffset": 3 * distance,
        "backXOffset": distance,
        "backYOffset": 0 * distance
    }
    var sides = ["front", "up", "left", "right", "down", "back"]

    var aggregation = {}
    var keys = [
        "up00", "up01", "up02", "up10", "up11", "up12", "up20", "up21", "up22",
        "front00", "front01", "front02", "front10", "front11", "front12", "front20", "front21", "front22",
        "right00", "right01", "right02", "right10", "right11", "right12", "right20", "right21", "right22",
        "left00", "left01", "left02", "left10", "left11", "left12", "left20", "left21", "left22",
        "down00", "down01", "down02", "down10", "down11", "down12", "down20", "down21", "down22",
        "back00", "back01", "back02", "back10", "back11", "back12", "back20", "back21", "back22"]

    vectors.forEach((vector, index) => {
        keys.forEach((key, keyIndex) => {
            if (aggregation[key] == undefined) {
                aggregation[key] = []
            }

            if (!aggregation[key].some((e) => e.key == vector[key])) {
                aggregation[key].push({ key: vector[key], count: 1 })
            } else {

                aggregation[key].filter(e => e.key == vector[key])[0].count += 1
            }
        })
    })

    var container = d3.create("div")

    var size = ttCubieSize * 9 + ttCubieMargin * 10;
    var board = container.append("div")
        .style("position", "relative")
        .style("width", size + "em")
        .style("height", (size + ttCubieSize * 3 + ttCubieMargin * 4) + "em")

    for (var side = 0; side < sides.length; side++) {
        for (var i1 = 0; i1 < 3; i1++) {
            for (var j = 0; j < 3; j++) {
                var key = sides[side] + i1 + j
                var col = 'white'
                var opacity = 1

                if (vectors.length == 0) {
                    col = "#F0F0F0"
                }
                else if (aggregation[key].length == 1) {
                    col = cubieToColour(aggregation[key][0].key)
                } else {

                    var max = 0.0
                    var total = 0
                    for (var k in aggregation[key]) {
                        var v = aggregation[key][k]
                        total += v.count

                        if (v.count > max) {
                            max = v.count
                            col = cubieToColour(aggregation[key][k].key)
                        }
                    }

                    opacity = (max / total)
                }

                var colorbox = board.append("div")
                    .style("left", offsetMap[sides[side] + "XOffset"] + j * (ttCubieMargin + ttCubieSize) + "em")
                    .style("top", offsetMap[sides[side] + "YOffset"] + i1 * (ttCubieMargin + ttCubieSize) + "em")
                    .style("background-color", col)
                    //.style("opacity", opacity)
                    .attr("class", "colorbox")

                if (opacity != 1) {
                    colorbox
                        //.style("border", "1px solid gray")
                        .style("opacity", 1)

                    colorbox.style("background-color", "#F0F0F0")
                    colorbox.append("div")
                        .style("background-color", col)
                        .style("transform", "scale(" + opacity + ")")
                        .style("opacity", opacity)
                        //.style("left", "-1px")
                        //.style("top", "-1px")
                        .attr("class", "colorbox")

                }
            }
        }
    }

    return container.html()
}

export var RubikLegend = ({ selection }) => {
    return <div dangerouslySetInnerHTML={{ __html: aggregateRubik(selection) }}></div>
}