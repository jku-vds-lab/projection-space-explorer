// import { Folder } from "@material-ui/icons";
import { LineUp, LineUpCategoricalColumnDesc, LineUpColumn, LineUpColumnDesc, LineUpNumberColumnDesc, LineUpStringColumnDesc } from "lineupjsx";
import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../Store/Store";
// import * as LineUpJs from 'lineupjs'
import './LineUpContext.scss';
import { setAggregationAction } from "../Ducks/AggregationDuck";
import { Column, ERenderMode, IDynamicHeight, IGroupItem, Ranking, IRenderContext, IOrderedGroup, ICellRenderer, ICellRendererFactory, IDataRow, IGroupCellRenderer, ISummaryRenderer, LinkColumn } from "lineupjs";


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
var cur_col = 0;
/**
 * Our component definition, by declaring our props with 'Props' we have static types for each of our property
 */
export const LineUpContext = connector(function ({ lineUpInput, setCurrentAggregation }: Props) {
    // In case we have no input, dont render at all
    if (!lineUpInput || !lineUpInput.data || !lineUpInput.show) {
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

                setCurrentAggregation(agg) //TODO: implement some additional Duck that manages points that should be currently shown (don't use dataset anymore...)
            }

            onRankingChanged(current)

        })

        // @ts-ignore
        if(smiles_col)
            // @ts-ignore
            ref.current.adapter.instance.data.getFirstRanking().columns.find(x => x.label == smiles_col).on("widthChanged", (prev, current) => {
                // @ts-ignore
                ref.current.adapter.instance.update()
            });

    }, [lineUpInput.data])




    let cols = lineUpInput.columns;

    cur_col = 0;
    let lineup_col_list = [];
    for (const i in cols) {
        let col = cols[i];
        let show = typeof col.meta_data !== 'undefined' && col.meta_data.includes("lineup_show");

        if(!col.meta_data || !col.meta_data.includes("lineup_none")){ // only if there is a "lineup_none" modifier at this column, we don't do anything
            if(col.meta_data && col.meta_data.includes("smiles_to_img")){
                smiles_col = "Structure";
                lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} label={smiles_col} visible={show} renderer="mySmilesRenderer" groupRenderer="mySmilesRenderer" width={150} />) 
            }

            if(col.isNumeric){
                lineup_col_list.push(<LineUpNumberColumnDesc key={i} column={i} domain={[col.range.min, col.range.max]} color={colors[cur_col]} visible={show} />);
                cur_col = (cur_col + 1) % colors.length;
            }else if(col.distinct)
                if(col.distinct.length/lineUpInput.data.length <= 0.5) // if the ratio between distinct categories and nr of data points is less than 1:2, the column is treated as a string
                    lineup_col_list.push(<LineUpCategoricalColumnDesc key={i} column={i} categories={col.distinct} visible={show} />)
                else
                    lineup_col_list.push(<LineUpStringColumnDesc width={100} key={i} column={i} visible={show} />) 
            else
                lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} visible={show} />)
        }
        
    }

    

    return <div className="LineUpParent">
        <LineUp ref={ref} data={lineUpInput.data} dynamicHeight={myDynamicHeight} renderers={{mySmilesRenderer: new MySmilesCellRenderer()}} >
            {lineup_col_list}
        </LineUp>
    </div>
})


let smiles_col = null;
function myDynamicHeight(data: IGroupItem[], ranking: Ranking): IDynamicHeight{
    if(smiles_col){
        const col = ranking.children.find(x => x.label == smiles_col);
        const col_width = col.getWidth();

        let height = function(item: IGroupItem | Readonly<IOrderedGroup>): number{
            return col_width;
        }
        let padding = function(item: IGroupItem | Readonly<IOrderedGroup>): number{
            return 0;
        }
        return { defaultHeight: col_width, height:height, padding:padding};
    }
    return null;
}


export class MySmilesCellRenderer implements ICellRendererFactory {
    readonly title: string = 'Image';
  
    canRender(col: Column, mode: ERenderMode): boolean {
      return col instanceof LinkColumn && mode === ERenderMode.CELL;
    }
  
    create(col: LinkColumn): ICellRenderer {
      return {
        template: `<img/>`,
        update: (n: HTMLImageElement, d: IDataRow) => {
            const formData = new FormData();
            formData.append('smiles', d.v[col.desc.column]);
            fetch('http://127.0.0.1:8080/get_mol_img', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.text())
            .then(data => n.src = "data:image/gif;base64," + data)
            .catch(error => {
                console.error(error)
            });
        }
      };
    }
  
    createGroup(col: LinkColumn, context: IRenderContext): IGroupCellRenderer {
        return {
            template: `<img/>`,
            update: (n: HTMLImageElement, group: IOrderedGroup) => {
                let smiles_list = [];
                const formData = new FormData();
                return context.tasks.groupRows(col, group, 'string', (rows) => {
                        rows.every((row) => {
                            const v = col.getLabel(row);
                            smiles_list.push(v);
                            formData.append('smiles_list', v);
                            return true;
                        });
                    })
                    .then(() => {
                        fetch('http://127.0.0.1:8080/get_common_mol_img', {
                            method: 'POST',
                            body: formData,
                        })
                        .then(response => response.text())
                        .then(data => n.src = "data:image/gif;base64," + data)
                        .catch(error => {
                            console.error(error)
                        });
                    });
            }
          };
    }
  
    createSummary(col: LinkColumn): ISummaryRenderer {
        return null;
    }
  }

//   export interface IGroup {
//     name: string;
//     color: string;
//   }
  
  