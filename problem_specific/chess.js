// Lookup table for chess UNICODE symbols
var symbols = {
  'wr': '&#9814;',
  'wn': '&#9816;',
  'wb': '&#9815;',
  'wk': '&#9812;',
  'wq': '&#9813;',
  'wp': '&#9817;',
  'br': '&#9820;',
  'bn': '&#9822;',
  'bb': '&#9821;',
  'bk': '&#9818;',
  'bq': '&#9819;',
  'bp': '&#9823;',
  '': ''
}





/**
 * Creates a string representing the dom element for
 * a chess chessboard.
 *
 * @param d the vector with the necessary fields.
 * @return a string representing a dom element
 */
function createChess(d) {
  if (d == null) return ""

  var container = d3.create("div")

  var board = container.append("div")
  .attr("class", "chessboard")

  // horizontal chess keys
  var keys = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ]

  // variable determining the current field color
  var col = "white"

  for (var i = 0; i < 64; i++) {
    if (i % 8 != 0) {
      if (col == "white") {
        col = "black"
      } else {
        col = "white"
      }
    }

    var key = keys[i % 8]
    var num = 8 - ((i / 8) >> 0)

    board.append("div")
    .attr("class", col)
    .html(symbols[d["" + key + num]])
  }

  return container.html()
}





function aggregateChess(vectors) {
  if (vectors.length == 1) return createChess(vectors[0])

  // Generate chess keys
  var keys = []

  var nums = [ 1, 2, 3, 4, 5, 6, 7, 8 ]
  var chars = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ]

  nums.forEach((index) => {
    chars.forEach((char) => {
      keys.push("" + char + index)
    })
  })

  var aggregation = {}

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

  var board = container.append("div")
  .attr("class", "chessboard")

  // horizontal chess keys
  var keys = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ]

  // variable determining the current field color
  var col = "white"


  for (var i = 0; i < 64; i++) {
    if (i % 8 != 0) {
      if (col == "white") {
        col = "black"
      } else {
        col = "white"
      }
    }

    var key = "" + keys[i % 8] + (8 - ((i / 8) >> 0))
    var content = ""
    var opacity = 1.0

    if (vectors.length == 0) {
      content = ""
    }
    else if (aggregation[key].length == 1) {
      content = symbols[aggregation[key][0].key]
    } else {
      var max = 0.0
      var total = 0
      for (k in aggregation[key]) {
        var v = aggregation[key][k]
        total += v.count

        if (v.count > max) {
          max = v.count
          content = symbols[aggregation[key][k].key]
        }
      }

      if (opacity < 0.05) console.log("he")
      opacity = (max / total)
    }

    board.append("div")
    .attr("class", col)
    .style("opacity", opacity)
    .html(content)
  }

  return container.html()
}



function chessLegend(colors) {
  var switches = ""

  var content = ""
  colors.forEach(color => {
    var comp = intToComponents(color.color)

    switches = switches +
    `
    <div class="custom-control custom-checkbox">
        <input type="checkbox" checked class="custom-control-input" id="chessSwitch${color.color}" onclick="toggleData(this, ${color.algo})">
        <label style="color: rgb(${comp.r}, ${comp.g}, ${comp.b})" class="custom-control-label" for="chessSwitch${color.color}" >${color.name}</label>
    </div>`

    content = content +
    `<div style="width: 100%; height: 1rem; background-image: linear-gradient(to right, rgba(${comp.r}, ${comp.g}, ${comp.b}, 0.2), rgba(${comp.r}, ${comp.g}, ${comp.b},1))">
     </div>`
  })




  var template = `
    <div>
      ${switches}

      <hr />

      <div>
        <img src="./textures/sprites/cross.png" style="width:1rem;height:1rem; vertical-align: middle"></img>
        <span style="vertical-align: middle">Starting point</span><br>
      </div>

      <div>
        <img src="./textures/sprites/circle.png" style="width:1rem;height:1rem; vertical-align: middle"></img>
        <span style="vertical-align: middle">Intermediate </span><a href="#" onclick="showIntermediatePoints()">toggle</a><br>
      </div>

      <div>
        <img src="./textures/sprites/square.png" style="width:1rem;height:1rem; vertical-align: middle"></img>
        <span style="vertical-align: middle">Checkpoint</span><br>
      </div>

      <div>
        <img src="./textures/sprites/star.png" style="width:1rem;height:1rem; vertical-align: middle"></img>
        <span style="vertical-align: middle">Solution</span><br>
      </div>



      <hr />

      ${content}

      <div class="d-flex justify-content-between">
            <div>
               opener
            </div>
            <div>
               end
            </div>
       </div>

    </div>`

  return template
}
