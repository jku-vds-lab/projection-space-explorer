var interpolator = d3.interpolateRgb("white", "blue")

function interpolate(value) {
  return interpolator(Math.log(1 + value * 1000) / 7)
}

function aggregateNeural(vectors) {
  if (vectors.length != 1) {
    return "<h5>Not useful</h5>"
  }
  var vector = vectors[0]

  var max = 0
  for (var y = 0; y < 9; y++) {
    for (var x = 0; x < 9; x++) {
      var value = vector[`cf${y}${x}`]
      if (value > max) {
        max = value
      }
    }
  }

  var container = d3.create('div')
  var table = container.append('table')
  .attr("class", "neural")

  for (var y = 0; y < 9; y++) {
    var row = table.append('tr')
    for (var x = 0; x < 9; x++) {
      row.append('td')
      .attr("class", "neuralcell")
      .style("background-color", interpolate(vector[`cf${y}${x}`] / max))
    }
  }

  var content = container.html()

  var svg = `<svg width="240px" height="240px" viewBox="0 0 240 240">
  <rect x="20", y="20" width="182" height="182" fill="transparent" stroke="black" stroke-width="1"></rect>

  <g font-size="10" style="text-anchor: middle">
    <text x="10" y="30">1</text>
    <text x="10" y="50">2</text>
    <text x="10" y="70">3</text>
    <text x="10" y="90">4</text>
    <text x="10" y="110">5</text>
    <text x="10" y="130">6</text>
    <text x="10" y="150">7</text>
    <text x="10" y="170">8</text>
    <text x="10" y="190">9</text>
  </g>

  <g font-size="10" style="text-anchor: middle">
    <text x="30" y="218">1</text>
    <text x="50" y="218">2</text>
    <text x="70" y="218">3</text>
    <text x="90" y="218">4</text>
    <text x="110" y="218">5</text>
    <text x="130" y="218">6</text>
    <text x="150" y="218">7</text>
    <text x="170" y="218">8</text>
    <text x="190" y="218">9</text>
  </g>

  <defs>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(0,0,255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255,255,255);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="218" y="20" width="10" height="182" stroke="black" stroke-width="1" fill="url(#grad2)" />

  <foreignObject x="20" y="20" width="180" height="180">

  ${content}

  </foreignObject>

</svg>`




  return svg
}
