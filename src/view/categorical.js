
function calculateOptions(vectors) {
  var categories = [
    {
      vectorKey: "algo",
      name: "Algorithm",
      type: "categorical",
      allowed: ["color", "size", "shape"],
      values: [
        {
          value: 0,
          display: "Beginner",
          shapeType: "star",
          color: 0xff0000
        },
        {
          value: 1,
          display: "Fridrich",
          shapeType: "circle",
          color: 0x00ff00
        }
      ]
    },
    {
      vectorKey: "cp",
      name: "Checkpoint",
      type: "categorical",
      allowed: ["transparency", "shape", "size", "color"],
      values: [
        {
          value: 0,
          display: "",
          shapeType: "circle",
          color: 0x00ff00
        },
        {
          value: 1,
          display: "",
          shapeType: "star",
          color: 0xff0000
        }
      ]
    },
    {
      vectorKey: "age",
      name: "Age",
      type: "quantitative",
      allowed: ["transparency"],
      values: {
        range: [0.3, 1.0],
        interpolation: "linear"
      }
    }
  ]

  var set = {
  }

  // Map to better structure
  categories.forEach(category => {
    var distinct = undefined
    if (category.type == 'categorical') {
      // Generate distinct set from values
      distinct = [... new Set(vectors.map(value => value[category.vectorKey]))]

    }

    category.allowed.forEach(allowedValue => {

      if (!(allowedValue in set)) {
        set[allowedValue] = { attributes: [] }
      }

      set[allowedValue].attributes.push({
        key: category.vectorKey,
        name: category.name,
        type: category.type,
        category: category,
        distinct: distinct
      })
    })
  })
  return set
}



class CategorySelection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      options: {},
      selection: {
        "color": "cp",
        "transparency": "",
        "shape": "",
        "size": ""
      }
    }

    this.handleChange = this.handleChange.bind(this);
  }

  setData(vectors) {
    this.vectors = vectors
    this.setState({
      options: calculateOptions(vectors)
    })
  }

  handleChange(event) {
    var state = this.state
    state.selection[event.target.id] = event.target.value
    this.setState(state)

    this.props.onChange(event.target.id, this.state.options[event.target.id].attributes.filter(a => a.key == event.target.value)[0].category)
  }

  render() {
//e => callback({ class: key, category: set[key].attributes.filter(v => v.key == e.target.value)[0].category })

    return <div>
      {Object.keys(this.state.options).map(key => {
        return <div class="form-group">
          <label for={key}>{key}</label>
          <select id={key} value={this.state.selection[key]} class="custom-select" onChange={this.handleChange}>
            {this.state.options[key].attributes.map(attribute => {
              return <option value={attribute.key}>{attribute.name}</option>
            })}
          </select>
        </div>
      })}
    </div>
  }
}

function renderUI(vectors, element, callback) {
  ReactDOM.render(<CategorySelection options={calculateOptions(vectors)}/>, element)
}



module.exports = {
  render: renderUI,
  calculateOptions: calculateOptions,
  CategorySelection: CategorySelection
}
