var React = require('react')
var ReactDOM = require('react-dom')


function testLEG(vectors) {
  var categories = [
    {
      vectorKey: "algo",
      name: "Algorithm",
      type: "categorical",
      allowed: [ "color", "size", "shape" ],
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
      allowed: [ "transparency", "shape", "size", "color" ],
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
      allowed: [ "transparency" ],
      values: {
        range: [ 0.3, 1.0 ],
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
      distinct = [ ... new Set(vectors.map(value => value[category.vectorKey])) ]

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


function UI(set, callback) {

  var s = `
  `
  console.log(set)
    return <div>
        { Object.keys(set).map(key => {
          return <div class="form-group">
          <label for={key}>{ key }</label>
          <select id={key} name="cars" class="custom-select" onChange={e => callback({ class: key, category: set[key].attributes.filter(v => v.key == e.target.value)[0].category })}>
            { set[key].attributes.map(attribute => {
              return <option value={ attribute.key }>{ attribute.name }</option>
            }) }
          </select>
        </div>
        }) }

    </div>
}

function renderUI(vectors, element, callback) {
  ReactDOM.render(UI(testLEG(vectors), callback), element)
}



module.exports = {
    render: renderUI
}
