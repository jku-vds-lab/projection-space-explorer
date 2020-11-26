// import { Folder } from "@material-ui/icons";
import { LineUp, LineUpCategoricalColumnDesc, LineUpColumn, LineUpNumberColumnDesc, LineUpStringColumnDesc } from "lineupjsx";
import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../Store/Store";
// import * as LineUpJs from 'lineupjs'
import './LineUpContext.scss';
import { setAggregationAction } from "../Ducks/AggregationDuck";
import { Column, ERenderMode, ICellRenderer, ICellRendererFactory, IDataRow, IGroupCellRenderer, ISummaryRenderer, LinkColumn, renderMissingDOM } from "lineupjs";


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
    setCurrentAggregation: samples => dispatch(setAggregationAction(samples))
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
export const LineUpContext = connector(function ({ lineUpInput, setCurrentAggregation }: Props) {
    // In case we have no input, dont render at all
    if (!lineUpInput || !lineUpInput.data) {
        return null;
    }
    lineUpInput.data.forEach(element => {
        if(element["clusterLabel"].length <= 0){
            element["clusterLabel"] = [-1];
        }
    });

    let ref = React.useRef()

    React.useEffect(() => {
        // @ts-ignore
        ref.current.adapter.instance.data.getFirstRanking().on('orderChanged.custom', (previous, current, previousGroups, currentGroups, dirtyReason) => {
            if (dirtyReason.indexOf('filter') === -1) {
                return;
            }

            const onRankingChanged = (current) => {
                let agg = []

                current.forEach(index => {
                    agg.push(lineUpInput.data[index])
                })

                setCurrentAggregation(agg)
            }

            onRankingChanged(current)

        })
    }, [lineUpInput.data])


    let cols = lineUpInput.columns;

    let lineup_col_list = [];
    for (const i in cols) {
        let col = cols[i];
        let show = typeof col.meta_data !== 'undefined' && col.meta_data.includes("lineup_show");

        if(show){ // if nothing is selected, everything will be shown
            if(col.meta_data.includes("image_from_url")){
                // /get_mol_img/<smiles>
                lineUpInput.data.forEach(element => {
                    // console.log(element[i]);
                    // element[i] = "http://127.0.0.1:8080/get_mol_img/CCC%28C%29%28C%29c1cc%28-n2nc3ccccc3n2%29c%28O%29c%28C%28C%29%28C%29CC%29c1"; //'/get_mol_img/' + element[i]; // todo parse url string
                });
                // console.log(lineUpInput.data);
                lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} visible={show} renderer="myImageRenderer" width={100} />)
            }else if(col.isNumeric)
                lineup_col_list.push(<LineUpNumberColumnDesc key={i} column={i} domain={[col.range.min, col.range.max]} color={colors[Math.floor(Math.random()*colors.length)]} visible={show} />);
            else if(col.distinct)
                if(col.distinct.length/lineUpInput.data.length <= 0.5) // if the ratio between distinct categories and nr of data points is less than 1:2, the column is treated as a string
                    lineup_col_list.push(<LineUpCategoricalColumnDesc key={i} column={i} categories={col.distinct} visible={show} />)
                else
                    lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} visible={show} />) 
            else
                lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} visible={show} />)
        }
        
    }

    return <div className="LineUpParent">
        <LineUp ref={ref} data={lineUpInput.data} rowHeight={100} renderers={{myImageRenderer: new MyImageCellRenderer()}}>
            {lineup_col_list}
        </LineUp>
    </div>
})

export class MyImageCellRenderer implements ICellRendererFactory {
    readonly title: string = 'Image';
  
    canRender(col: Column, mode: ERenderMode): boolean {
      return col instanceof LinkColumn && mode === ERenderMode.CELL;
    }
  
    create(col: LinkColumn): ICellRenderer {
      return {
        template: `<img/>`,
        update: (n: HTMLImageElement, d: IDataRow) => {
            console.log(d);
            //TODO: try to send the smiles string in body.. maybe the uri encoding messes up some components
            let uri = 'http://127.0.0.1:8080/get_mol_img/' + encodeURIComponent(d.v.Smiles);
            n.src = d.v.smiles_url;
        }
      };
    }
  
    createGroup(): IGroupCellRenderer {
      return null;
    }
  
    createSummary(): ISummaryRenderer {
      return null;
    }
  }

