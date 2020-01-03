


class GenericLegend extends React.Component {
    constructor(props) {
        super(props)

        //"color": "algo"
    }

    render() {
        return <div></div>
    }
}


function chessLegend(colors) {
    var switches = ""
  
    var content = ""
    colors.forEach(color => {
      var comp = util.hexToRGB(color.color)
  
      switches = switches +
      `
      <div class="custom-control custom-checkbox">
          <input type="checkbox" checked class="custom-control-input" id="chessSwitch${color.color}" onclick="window.toggleData(this, ${color.algo})">
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
          <span style="vertical-align: middle">Intermediate </span><a href="#" onclick="window.showIntermediatePoints()">toggle</a><br>
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