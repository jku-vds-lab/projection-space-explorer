import { Folder } from "@material-ui/icons";
import { LineUp, LineUpCategoricalColumnDesc, LineUpColumn, LineUpNumberColumnDesc, LineUpStringColumnDesc } from "lineupjsx";
import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../Store/Store";


/**
 * Declares a function which maps application state to component properties (by name)
 * 
 * @param state The whole state of the application (contains a field for each duck!)
 */
const mapStateToProps = (state: RootState) => ({
    lineUpInput: state.lineUpInput
})




/**
 * Declares a function which maps dispatch events to component properties (by name)
 * 
 * @param dispatch The generic dispatch function declared in redux
 */
const mapDispatchToProps = dispatch => ({
    // setPropertyname1: value => dispatch(duckAction1(value))
})


/**
 * Factory method which is declared here so we can get a static type in 'ConnectedProps'
 */
const connector = connect(mapStateToProps, mapDispatchToProps);


/**
 * Type that holds the props we declared above in mapStateToProps and mapDispatchToProps
 */
type PropsFromRedux = ConnectedProps<typeof connector>




/**
 * Type that holds every property that is relevant to our component, that is the props declared above + our OWN component props
 */
type Props = PropsFromRedux & {
    // My own property 1
    // My own property 2
}



// taken from: https://github.com/VirginiaSabando/ChemVA/blob/master/ChemVA_client/public/main.js
var colors = ['#000000','#E69F00','#56B4E9','#009E73','#F0E442', '#0072B2', '#D55E00','#CC79A7'];
/**
 * Our component definition, by declaring our props with 'Props' we have static types for each of our property
 */
export const LineUpContext = connector(function({ lineUpInput }: Props) {
    // console.log(lineUpInput);
    if (!lineUpInput || !lineUpInput.vectors) {
        return null;
    }
    lineUpInput.vectors.forEach(element => {
        if(element["clusterLabel"].length <= 0){
            element["clusterLabel"] = [-1];
        }
    });
    let cols = lineUpInput.columns;

    let lineup_col_list = [];
    for (const i in cols) {
        let col = cols[i];
        let show = typeof col.meta_data !== 'undefined' && col.meta_data.includes("lineup_show");

        // if(col.meta_data && col.meta_data.includes("render_image"))
        //     lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} visible={show} renderer="image" />)
        if(col.isNumeric)
            lineup_col_list.push(<LineUpNumberColumnDesc key={i} column={i} domain={[col.range.min, col.range.max]} color={colors[Math.floor(Math.random()*colors.length)]} visible={show} />);
        else if(col.distinct)
            if(col.distinct.length/lineUpInput.vectors.length <= 0.5) // if the ratio between distinct categories and nr of data points is less than 1:2, the column is treated as a string
                lineup_col_list.push(<LineUpCategoricalColumnDesc key={i} column={i} categories={col.distinct} visible={show} />)
            else
                lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} visible={show} />) 
        else
            lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} visible={show} />)
        
    }
    
    return <div style={{ width: '100%', height: 500, position: 'relative' }}>
        <LineUp data={lineUpInput.vectors}>
            {lineup_col_list}
        </LineUp>
    </div>
})