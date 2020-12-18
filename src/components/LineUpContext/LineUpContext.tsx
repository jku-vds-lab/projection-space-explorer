import { LineUp, LineUpCategoricalColumnDesc, LineUpColumn, LineUpColumnDesc, LineUpImposeColumn, LineUpNumberColumnDesc, LineUpRanking, LineUpStringColumnDesc, LineUpSupportColumn } from "lineupjsx";
import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../Store/Store";
// import * as LineUpJs from 'lineupjs'
import './LineUpContext.scss';
import { setAggregationAction } from "../Ducks/AggregationDuck";
import { createSelectionDesc, Column, ERenderMode, IDynamicHeight, IGroupItem, Ranking, IRenderContext, IOrderedGroup, ICellRenderer, ICellRendererFactory, IDataRow, IGroupCellRenderer, ISummaryRenderer, LinkColumn } from "lineupjs";

import * as backend_utils from "../../utils/backend-connect";

/**
 * Declares a function which maps application state to component properties (by name)
 * 
 * @param state The whole state of the application (contains a field for each duck!)
 */
const mapStateToProps = (state: RootState) => ({
    lineUpInput: state.lineUpInput,
    currentAggregation: state.currentAggregation
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
// type Props = PropsFromRedux & {
//     onFilter: any
//     // My own property 1
//     // My own property 2
// }

type Props = {
    lineUpInput, currentAggregation, setCurrentAggregation, onFilter
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }


/**
 * Our component definition, by declaring our props with 'Props' we have static types for each of our property
 */
export const LineUpContext = connector(function ({ lineUpInput, currentAggregation, setCurrentAggregation, onFilter }: Props) {
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
        const lineup = ref.current.adapter.instance;
        const ranking = lineup.data.getFirstRanking();

        // make lineup filter interact with the scatter plot view
        ranking.on('orderChanged.custom', (previous, current, previousGroups, currentGroups, dirtyReason) => {
            
            if (dirtyReason.indexOf('filter') === -1) {
                return;
            }

            const onRankingChanged = (current) => {
                for (let i=0; i < lineUpInput.data.length; i++) {
                    lineUpInput.data[i].view.lineUpFiltered = !current.includes(i);
                }

                onFilter()

            }

            onRankingChanged(current)

        })

        
        // make lineup selection interact with the scatter plot view
        lineup.on('selectionChanged', e => {
            const currentSelection_lineup = lineup.getSelection();
            if(currentSelection_lineup.length == 0) return; // selectionChanged is called during creation of lineup, before the current aggregation was set; therefore, it would always set the current aggregation to nothing because in the lineup table nothing was selected yet
            
            const currentSelection_scatter = lineUpInput.data.map((x,i) => {if(x.view.selected) return i;}).filter(x => x !== undefined);
            
            if(!arrayEquals(currentSelection_lineup, currentSelection_scatter)){ // need to check, if the current lineup selection is already the current aggregation
                let agg = [];
                currentSelection_lineup.forEach(index => {
                    agg.push(lineUpInput.data[index]);
                })

                setCurrentAggregation(agg);
                
            }
        });



        // update lineup when smiles_column width changes
        if(smiles_col){
            const lineup_smiles_col = ranking.columns.find(x => x.label == smiles_col);
            if(lineup_smiles_col)
                lineup_smiles_col.on("widthChanged", (prev, current) => {
                    lineup.update()
                });
        }

    }, [lineUpInput.data])

    // this effect is allways executed after the component is rendered when currentAggregation changed
    React.useEffect(() => {
        // @ts-ignore
        const lineup = ref.current.adapter.instance;
        const ranking = lineup.data.getFirstRanking();

        
        // select those instances that are also selected in the scatter plot view
        if(currentAggregation && currentAggregation.length > 0){
            const currentSelection_scatter = lineUpInput.data.map((x,i) => {if(x.view.selected) return i;}).filter(x => x !== undefined);
            lineup.setSelection(currentSelection_scatter);

            // add selection checkbox column
            let selection_col = ranking.columns.find(x => x.label == "Selection Checkboxes");
            if(!selection_col){
                selection_col = lineup.data.create(createSelectionDesc());
                if(selection_col){
                    ranking.insert(selection_col, 1);
                }
            }
            // set the grouping to selection checkboxes
            ranking.groupBy(selection_col, -1) // remove grouping first
            ranking.groupBy(selection_col);
        }

        

    }, [currentAggregation])



    let cols = lineUpInput.columns;

    let lineup_col_list = [];
    // lineup_col_list.push(<LineUpSupportColumn key={"support"} type="*" />) // inserts default columns like rank, aggregate, selection checkboxes

    for (const i in cols) {
        let col = cols[i];
        let show = typeof col.meta_data !== 'undefined' && col.meta_data.includes("lineup_show");

        if(!col.meta_data || !col.meta_data.includes("lineup_none")){ // only if there is a "lineup_none" modifier at this column, we don't do anything
            if(col.meta_data && col.meta_data.includes("smiles_to_img")){
                smiles_col = "Structure";
                lineup_col_list.push(<LineUpStringColumnDesc key={smiles_col} column={i} label={smiles_col} visible={show} renderer="mySmilesRenderer" groupRenderer="mySmilesRenderer" width={150} />) 
            }

            if(col.isNumeric)
                lineup_col_list.push(<LineUpNumberColumnDesc key={i} column={i} domain={[col.range.min, col.range.max]} visible={show} />);
            else if(col.distinct)
                if(col.distinct.length/lineUpInput.data.length <= 0.5) // if the ratio between distinct categories and nr of data points is less than 1:2, the column is treated as a string
                    lineup_col_list.push(<LineUpCategoricalColumnDesc key={i} column={i} categories={col.distinct} visible={show} />)
                else
                    lineup_col_list.push(<LineUpStringColumnDesc width={100} key={i} column={i} visible={show} />) 
            else
                lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} visible={show} />)

        }
    }

    return <div className="LineUpParent">
        <LineUp ref={ref} data={lineUpInput.data} dynamicHeight={myDynamicHeight} renderers={{mySmilesRenderer: new MySmilesCellRenderer()}} defaultRanking={true} deriveColors> {/* deriveColumns deriveColors */}
            {/* <LineUpRanking groupBy="Selection Checkboxes" sortBy="Rank:desc"> */}
                {/* <LineUpSupportColumn type="selection" /> */}
                {lineup_col_list}
            {/* </LineUpRanking> */}
        </LineUp>
    </div>
})


let smiles_col = null;
function myDynamicHeight(data: IGroupItem[], ranking: Ranking): IDynamicHeight{
    if(smiles_col){
        const col = ranking.children.find(x => x.label == smiles_col);
        if(!col)
            return null;

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
                // @ts-ignore
                backend_utils.get_structure_from_smiles(d.v[col.desc.column]).then(x => n.src = "data:image/gif;base64," + x);
            }
        };
    }
  
    createGroup(col: LinkColumn, context: IRenderContext): IGroupCellRenderer {
        return {
            template: `<img/>`,
            update: (n: HTMLImageElement, group: IOrderedGroup) => {
                const formData = new FormData();
                return context.tasks.groupRows(col, group, 'string', (rows) => {
                        rows.every((row) => {
                            const v = col.getLabel(row);
                            formData.append('smiles_list', v);
                            return true;
                        });
                    })
                    .then(() => {
                        backend_utils.get_mcs_from_smiles_list(formData)
                        .then(data => n.src = "data:image/gif;base64," + data);
                    });
            }
          };
    }
  
    createSummary(col: LinkColumn): ISummaryRenderer {
        return null;
    }
  }

  