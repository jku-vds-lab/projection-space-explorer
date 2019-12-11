var React = require('react')
var ReactDOM = require('react-dom')


const e = React.createElement;


// Lookup table for chess UNICODE symbols
var symbols = {
  'wr': '../textures/chess/Chess_rlt45.svg',
  'wn': '../textures/chess/Chess_nlt45.svg',
  'wb': '../textures/chess/Chess_blt45.svg',
  'wk': '../textures/chess/Chess_klt45.svg',
  'wq': '../textures/chess/Chess_qlt45.svg',
  'wp': '../textures/chess/Chess_plt45.svg',
  'br': '../textures/chess/Chess_rdt45.svg',
  'bn': '../textures/chess/Chess_ndt45.svg',
  'bb': '../textures/chess/Chess_bdt45.svg',
  'bk': '../textures/chess/Chess_kdt45.svg',
  'bq': '../textures/chess/Chess_qdt45.svg',
  'bp': '../textures/chess/Chess_pdt45.svg',
  '': ''
}

class Piece extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  setPiece(piece) {
    this.setState({ piece: piece })
  }

  render() {
    var img = e('img', this.state.piece != null && this.state.piece != "" ? { class: 'figure', src: symbols[this.state.piece] } : null, null)

    return e('div', { class: this.props.color + ' d-flex align-items-center justify-content-center' }, img)
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = { vector: {} }

    console.log(this.comps)
  }

  setVector(vector) {
    Object.keys(this.comps).forEach(key => {
      this.comps[key].current.setState({ piece: vector[key] })
    })
  }

  render() {
    this.comps = []
    var pieces = []
    var keys = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ]
    var white = true
    for (var i = 0; i < 64; i++) {
      var key = "" + keys[i % 8] + (8 - ((i / 8) >> 0))
      if (i % 8 != 0) {
        white = !white
      }

      
      this.comps[key] = React.createRef()
      pieces.push(e(Piece, { color: white ? 'white' : 'black', ref: this.comps[key] }, null))
    }
    console.log("RENDERED")
    return e('div', { class: 'chessboard' }, pieces)
  }
}

var board = ReactDOM.render(e(Board, null, null), document.getElementById('test'))
board.setVector({ 'a2': 'wk' })
board.setVector({ })