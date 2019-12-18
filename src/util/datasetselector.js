class DatasetDatabase {
    constructor() {
        this.data = [
            {
                display: "Chess: 190 Games",
                path: "datasets/chess/chess16k.csv",
                type: "chess"
            },
            {
                display: "Chess: 450 Games",
                path: "datasets/chess/chess40k.csv",
                type: "chess"
            },
            {
                display: "Rubik: 1x2 Different Origins",
                path: "datasets/rubik/cube1x2_different_origins.csv",
                type: "rubik"
            },
            {
                display: "Rubik: 1x2 Same Origins",
                path: "datasets/rubik/cube1x2.csv",
                type: "rubik"
            },
            {
                display: "Rubik: 5x2 Different Origins",
                path: "datasets/rubik/cube5x2_different_origins.csv",
                type: "rubik"
            },
            {
                display: "Rubik: 5x2 Same Origins",
                path: "datasets/rubik/cube5x2.csv",
                type: "rubik"
            },
            {
                display: "Rubik: 10x2 Different Origins",
                path: "datasets/rubik/cube10x2_different_origins.csv",
                type: "rubik"
            },
            {
                display: "Rubik: 10x2 Same Origins",
                path: "datasets/rubik/cube10x2.csv",
                type: "rubik"
            },
            {
                display: "Rubik: 100x2 Different Origins",
                path: "datasets/rubik/cube100x2_different_origins.csv",
                type: "rubik"
            },
            {
                display: "Rubik: 100x2 Same Origins",
                path: "datasets/rubik/cube100x2.csv",
                type: "rubik"
            },
            {
                display: "Neural: Random Weights",
                path: "datasets/neural/random_weights.csv",
                type: "neural"
            },
            {
                display: "Neural: Random Confusion Matrix",
                path: "neural/random_confmat.csv",
                type: "neural"
            },
            {
                display: "Neural: Learning Weights",
                path: "datasets/neural/learning_weights.csv",
                type: "neural"
            },
            {
                display: "Neural: Learning Confusion Matrix",
                path: "datasets/neural/learning_confmat.csv",
                type: "neural"
            }
        ]
    }

    getByPath(path) {
        return this.data.filter(e => e.path == path)[0]
    }
}

export default class DatasetSelector extends React.Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this);
        this.database = new DatasetDatabase()

        this.state = { value: this.props.preselect }
        console.log("state is")
        console.log(this.state)
    }

    handleChange(event) {
        this.setState({ value: event.target.value })

        this.props.onChange(this.database.getByPath(event.target.value))
    }



    render() {
        return <div class="form-group">
            <label for="exampleFormControlSelect1">Select Dataset</label>
            <select id="setselect" value={this.state.value} class="custom-select" onChange={this.handleChange}>
                {this.database.data.map(entry => {
                    return <option value={entry.path}>{entry.display}</option>
                })}
            </select>
        </div>
    }
}