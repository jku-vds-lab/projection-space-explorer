var React = require('react')
var ReactDOM = require('react-dom')


function UI() {
    return <div>
        <div>Color</div>
        <div class="form-group">
            <label for="exampleFormControlSelect1">Select Dataset</label>
            <select id="setselect" name="cars" class="custom-select" onchange="selectDataset(this.value)">
              <option value="chess_chess16k.csv">Chess: 190 Games</option>
              <option value="chess_chess40k.csv">Chess: 450 Games</option>
              <option value="rubik_cube1x2_different_origins.csv">Rubik: 1x2 Different Origins</option>
              <option value="rubik_cube1x2.csv">Rubik: 1x2 Same Origins</option>
              <option value="rubik_cube5x2_different_origins.csv">Rubik: 5x2 Different Origins</option>
              <option value="rubik_cube5x2.csv">Rubik: 5x2 Same Origins</option>
              <option selected value="rubik_cube10x2_different_origins.csv">Rubik: 10x2 Different Origins</option>
              <option value="rubik_cube10x2.csv">Rubik: 10x2 Same Origins</option>
              <option value="rubik_cube100x2_different_origins.csv">Rubik: 100x2 Different Origins</option>
              <option value="rubik_cube100x2.csv">Rubik: 100x2 Same Origins</option>
              <option value="neural_random_weights.csv">Neural: Random Weights</option>
              <option value="neural_random_confmat.csv">Neural: Confusion Matrix</option>
              <option value="neural_learning_weights.csv">Neural: Learning Weights</option>
              <option value="neural_learning_confmat.csv">Neural: Learning Confusion Matrix</option>
            </select>
          </div>
    </div>
}

console.log("BEFORE")
console.log(UI())
console.log("AFTER")

ReactDOM.render(UI(), document.getElementById('test'))

module.exports = {
    test: 'hello'
}