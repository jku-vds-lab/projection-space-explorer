import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../Store/Store";
import * as LineUpJS from 'lineupjs'
import './LineUpContext.scss';
import { setAggregationAction } from "../Ducks/AggregationDuck";
import { StringColumn, IStringFilter, equal, createSelectionDesc, Column, ERenderMode, IDynamicHeight, IGroupItem, Ranking, IRenderContext, IOrderedGroup, ICellRenderer, ICellRendererFactory, IDataRow, IGroupCellRenderer, ISummaryRenderer, LinkColumn, renderMissingDOM, ICategoricalColumn, isCategoricalColumn, isCategoricalLikeColumn } from "lineupjs";

import * as backend_utils from "../../utils/backend-connect";
import { FeatureType } from "../Utility/Data/FeatureType";
import { PrebuiltFeatures } from "../Utility/Data/Dataset";
import { setLineUpInput_lineup, setLineUpInput_visibility } from "../Ducks/LineUpInputDuck";
import { MyWindowPortal } from "../Overlays/WindowPortal/WindowPortal";
import * as _ from 'lodash';
import { Button, FormControlLabel, Switch } from "@material-ui/core";
import BarCellRenderer from "./BarCellRenderer";

/**
 * Declares a function which maps application state to component properties (by name)
 * 
 * @param state The whole state of the application (contains a field for each duck!)
 */
const mapStateToProps = (state: RootState) => ({
    lineUpInput: state.lineUpInput,
    currentAggregation: state.currentAggregation,
    activeStory: state.stories.active,
})


/**
 * Declares a function which maps dispatch events to component properties (by name)
 * 
 * @param dispatch The generic dispatch function declared in redux
 */
const mapDispatchToProps = dispatch => ({
    setCurrentAggregation: samples => dispatch(setAggregationAction(samples)),
    setLineUpInput_visibility: visibility => dispatch(setLineUpInput_visibility(visibility)),
    setLineUpInput_lineup: input => dispatch(setLineUpInput_lineup(input)),
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

type Props = PropsFromRedux & {
    onFilter, hoverUpdate
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }


const EXCLUDED_COLUMNS = ["__meta__", "x", "y", "algo", "clusterProbability"];
// let lineup = null;
const UPDATER = "lineup";
const UNIQUE_ID = "unique_ID";

/**
 * Our component definition, by declaring our props with 'Props' we have static types for each of our property
 */
export const LineUpContext = connector(function ({ lineUpInput, currentAggregation, setCurrentAggregation, setLineUpInput_lineup, setLineUpInput_visibility, onFilter, activeStory, hoverUpdate }: Props) { // hoverState -> makes everything slow....
    // In case we have no input, dont render at all
    if (!lineUpInput || !lineUpInput.data || !lineUpInput.show) {
        return null;
    }
    let lineup_ref = React.useRef();
    
    const debouncedHighlight = React.useCallback(_.debounce(hover_item => hoverUpdate(hover_item, UPDATER), 200), []);

    React.useEffect(() => {

        // if(lineUpInput.dump){
        //     try {
        //         const json_parsed = JSON.parse(lineUpInput.dump)
        //         const restored = fromDumpFile(json_parsed)
        //         console.log(restored);
        //         const builder = buildLineup(lineUpInput.columns, restored.dat).restore(restored.dump);
        //         // const builder = LineUpJS.builder(restored.data).restore(restored.dump);
        //         lineup?.destroy();
        //         lineup = builder.build(lineup_ref.current);
        //         return;
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }


        let lineup_data = [];
        lineUpInput.data.forEach(element => {
            // if(element[PrebuiltFeatures.ClusterLabel].length <= 0){
            //     element[PrebuiltFeatures.ClusterLabel] = [-1];
            // }
            let row = Object.assign({}, element)
            row[PrebuiltFeatures.ClusterLabel] = element[PrebuiltFeatures.ClusterLabel].toString();
            row[UNIQUE_ID] = element["__meta__"]["view"]["meshIndex"];
            lineup_data.push(row);
        });


        const builder = buildLineup(lineUpInput.columns, lineup_data); //lineUpInput.data
        lineUpInput.lineup?.destroy();
        let lineup = null;
        lineup = builder.build(lineup_ref.current);


        const ranking = lineup.data.getFirstRanking();

        // add selection checkbox column
        let selection_col = ranking.children.find(x => x.label == "Selection Checkboxes");
        if(!selection_col){
            selection_col = lineup.data.create(createSelectionDesc());
            if(selection_col){
                ranking.insert(selection_col, 1);
            }
        }

        // // make lineup filter interact with the scatter plot view
        // ranking.on('orderChanged.custom', (previous, current, previousGroups, currentGroups, dirtyReason) => {
            
        //     if (dirtyReason.indexOf('filter') === -1) {
        //         return;
        //     }

        //     const onRankingChanged = (current) => {
        //         for (let i=0; i < lineUpInput.data.length; i++) {
        //             lineUpInput.data[i].view.lineUpFiltered = !current.includes(i);
        //         }

        //         onFilter()

        //     }

        //     onRankingChanged(current)
        // });
        
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

        lineup.on('highlightChanged', idx => {
            let hover_item = null;
            if(idx >= 0){
                hover_item = lineUpInput.data[idx];
            }
            debouncedHighlight(hover_item);
        });

        // update lineup when smiles_column width changes
        if(smiles_structure_columns && smiles_structure_columns.length > 0){
            const lineup_smiles_cols = ranking.children.filter(x => smiles_structure_columns.includes(x.label));
            for (const i in lineup_smiles_cols){
                let lineup_smiles_col = lineup_smiles_cols[i];
                lineup_smiles_col.on("widthChanged", (prev, current) => {
                    lineup.update()
                });

                // custom filter adapted from michael
                const filterChanged = (prev, cur: IStringFilter) => {
                    if(prev?.filter !== cur?.filter){ // only update, if it is a new filter
                        const filter = typeof(cur?.filter) === 'string' ? cur?.filter : null; // only allow string filters -> no regex (TODO: remove regex checkbox)
                        if(lineup_smiles_col && filter) {
                            backend_utils.get_substructure_count(lineUpInput.data.map((d) => d[lineup_smiles_col.desc.column]), filter).then((matches) => {
                                const validSmiles = matches.filter(([smiles, count]) => count > 0).map(([smiles, count]) => smiles);
                                lineup_smiles_col.setFilter({
                                    filter,
                                    valid: new Set(validSmiles),
                                    filterMissing: cur.filterMissing
                                });
                            }).catch((e) => {
                                lineup_smiles_col.setFilter(null);
                            });
                        }
                    }
                };
                lineup_smiles_col.on(StringColumn.EVENT_FILTER_CHANGED, filterChanged);
            }
        }

        setLineUpInput_lineup(lineup);

    }, [lineUpInput.data, lineUpInput.columns, activeStory, activeStory?.clusters, activeStory?.clusters?.length]);

    // React.useEffect(() => {
    //     // update lineup, if current storybook (current cluster) changed
    //     lineup?.update();
    // }, [activeStory, activeStory?.clusters?.length]); // TODO: does not update when "add from selection" -> only if story book changes


    // this effect is allways executed after the component is rendered when currentAggregation changed
    React.useEffect(() => {

        if(lineUpInput.lineup != null){

            // select those instances that are also selected in the scatter plot view
            if(currentAggregation && currentAggregation.length > 0){
                const currentSelection_scatter = lineUpInput.data.map((x,i) => {if(x.view.selected) return i;}).filter(x => x !== undefined);
                lineUpInput.lineup.setSelection(currentSelection_scatter);
                
                // const lineup_idx = lineup.renderer?.rankings[0]?.findNearest(currentSelection_scatter);
                // lineup.renderer?.rankings[0]?.scrollIntoView(lineup_idx);

                // set the grouping to selection checkboxes -> uncomment if this should be automatically if something changes
                // const ranking = lineup.data.getFirstRanking();
                // let selection_col = ranking.children.find(x => x.label == "Selection Checkboxes");
                // ranking.groupBy(selection_col, -1) // remove grouping first
                // ranking.groupBy(selection_col);
            }
        }
        
    }, [lineUpInput.lineup, currentAggregation])

    React.useEffect(() => {
        if(lineUpInput.lineup && lineUpInput.lineup.data){
            console.log(lineUpInput.filter)
            if(lineUpInput.filter){
                const ranking = lineUpInput.lineup.data.getFirstRanking();
                for (const key in lineUpInput.filter) {
                    const cur_filter = lineUpInput.filter[key];
    
                    if(key === 'selection'){
                        const filter_col = ranking.children.find(x => {return x.desc.column==UNIQUE_ID;});
                        
                        let regex_str = "";
                        currentAggregation.forEach(element => {
                            regex_str += "|"
                            regex_str += element["__meta__"]["view"]["meshIndex"]
                        });
                        regex_str = regex_str.substr(1); // remove the leading "|"
                        const my_regex = new RegExp(`^(${regex_str})$`, "i"); // i modifier says that it's not case sensitive; ^ means start of string; $ means end of string
                        filter_col?.setFilter({
                            filter: my_regex,
                            filterMissing: true
                        });
                    }else{
                        const filter_col = ranking.children.find(x => {return x.desc.column==key;});
                        const my_regex = new RegExp(`^(.+,)?${cur_filter}(,.+)?$`, "i"); // i modifier says that it's not case sensitive; ^ means start of string; $ means end of string
                        filter_col?.setFilter({
                            filter: my_regex,
                            filterMissing: true
                        });
                    }
                }
            
            }else{
                const ranking = lineUpInput.lineup.data.getFirstRanking();
                ranking.clearFilters();
            }

        }
    }, [lineUpInput.lineup, lineUpInput.filter]);


    // const debouncedHighlight = React.useCallback(debounce<any>(lineup_idx => lineup?.setHighlight(lineup_idx, true), 1000), []);

    // --> not sure if this makes sense without scrolling
    // --> hoverstate updates make lineup slow
    //React.useEffect(() => {
        // hover the instance that is hovered in the scatter plot view
    //    if(lineup && lineUpInput.data){ // TODO: sometimes there is a lineup bug when too many rows are highlighted??
    //        if(hoverState && hoverState.data){
    //            if(hoverState.updater != UPDATER){
                    // const lineup_idx = lineUpInput.data.findIndex((x) => x && x["__meta__"] && hoverState.data["__meta__"] && x["__meta__"]["view"]["meshIndex"] == hoverState.data["__meta__"]["view"]["meshIndex"]);
    //                const lineup_idx = 1
    //                if(lineup_idx >= 0){
    //                    lineup.setHighlight(lineup_idx, false); // flag that tells, if we want to scoll to that row
                        
    //                 }
    //             }
    //         }
    //         // else{
    //         //     try{
    //         //         lineup.setHighlight(-1, false);
    //         //     }catch(ex){
    //         //         console.log("exception when changing highliged row in lineup:", ex);
    //         //     }
    //         // }
            
    //     }
        
    // }, [hoverState]);




    //https://github.com/lineupjs/lineup_app/blob/master/src/export.ts
    return false ? 
        <MyWindowPortal onClose={() => {lineUpInput.lineup?.destroy(); setLineUpInput_visibility(false);}}>
            <div ref={lineup_ref} id="lineup_view"></div>
        </MyWindowPortal> : 
        <div className="LineUpParent">
            <div><div ref={lineup_ref} id="lineup_view"></div></div>
        </div>//<Button onClick={() => {downloadImpl(JSON.stringify(lineup?.dump, null, ' '), `lineup-export.json`, 'application/json');}}>Export Lineup</Button>
        
    // return <div style={{ height: '100%' }}>{false ? 
    //         <MyWindowPortal onClose={() => {lineup?.destroy(); setLineUpInput_visibility(false);}}>
    //             <div ref={lineup_ref} id="lineup_view"></div>
    //         </MyWindowPortal> : 
    //         <div className="LineUpParent"><div ref={lineup_ref} id="lineup_view"></div></div>}
    //     </div>;
})



let smiles_structure_columns = [];
function myDynamicHeight(data: IGroupItem[], ranking: Ranking): IDynamicHeight{
    if(smiles_structure_columns.length > 0){
        const cols = ranking.children.filter(x => smiles_structure_columns.includes(x.label));
        if(!cols || cols.length == 0)
            return null;

        const col_widths = cols.map(x => x.getWidth());
        const col_width = Math.max(...col_widths);//col.getWidth();

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


function buildLineup(cols, data){
    const builder = LineUpJS.builder(data);

    for (const i in cols) {
        let col = cols[i];
        let show = true; //!(typeof col.metaInformation.hideLineUp !== 'undefined' && col.metaInformation.hideLineUp); // hide column if "hideLineUp" is specified -> there is a lineup bug with that option

        if(!EXCLUDED_COLUMNS.includes(i) && (Object.keys(col.metaInformation).length <= 0 || !col.metaInformation.noLineUp)){ // only if there is a "noLineUp" modifier at this column or thix column is excluded, we don't do anything
            if(col.metaInformation.imgSmiles){
                const smiles_col = "Structure: " + i;
                smiles_structure_columns.push(smiles_col);
                builder.column(LineUpJS.buildColumn("mySmilesStructureColumn", i).label(smiles_col).renderer("mySmilesStructureRenderer", "mySmilesStructureRenderer").width(50).build([]));
                
            }
            if(i == PrebuiltFeatures.ClusterLabel){
                builder.column(LineUpJS.buildCategoricalColumn(i).custom("visible", show).width(70)); // shows avg of cluster labels if there is more than one label
            }
            else if(typeof col.featureType !== 'undefined'){
                switch(col.featureType){
                    case FeatureType.Categorical:
                        if(data && col.distinct && col.distinct.length/data.length <= 0.5) // if the ratio between distinct categories and nr of data points is less than 1:2, the column is treated as a string
                            builder.column(LineUpJS.buildCategoricalColumn(i).custom("visible", show));
                        else
                            builder.column(LineUpJS.buildStringColumn(i).width(50).custom("visible", show));
                        break;
                    case FeatureType.Quantitative:
                        builder.column(LineUpJS.buildNumberColumn(i).numberFormat(".2f").custom("visible", show));//.renderer("myBarCellRenderer")); //.renderer("numberWithValues")
                        break;
                    case FeatureType.Date:
                        builder.column(LineUpJS.buildDateColumn(i).custom("visible", show));
                        break;
                    case FeatureType.String:
                        builder.column(LineUpJS.buildStringColumn(i).width(50).custom("visible", show));
                        break;
                    default:
                        builder.column(LineUpJS.buildStringColumn(i).width(50).custom("visible", show));
                        break;

                }
            }else{
                if(col.isNumeric){
                    builder.column(LineUpJS.buildNumberColumn(i, [col.range.min, col.range.max]).numberFormat(".2f").custom("visible", show));//.renderer("myBarCellRenderer"));
                }else if(col.distinct)
                    if(data && col.distinct.length/data.length <= 0.5) // if the ratio between distinct categories and nr of data points is less than 1:2, the column is treated as a string
                        builder.column(LineUpJS.buildCategoricalColumn(i).custom("visible", show));
                    else
                        builder.column(LineUpJS.buildStringColumn(i).width(50).custom("visible", show));   
                else
                    builder.column(LineUpJS.buildStringColumn(i).width(50).custom("visible", show));   
            }
        }
    }
    
    builder.column(LineUpJS.buildStringColumn("Annotations").editable())
    builder.column(LineUpJS.buildStringColumn(UNIQUE_ID).width(50)); // we need this to be able to filter by all indices; this ID corresponds to the mesh index

    builder.defaultRanking(true);
    builder.deriveColors();
    builder.registerRenderer("mySmilesStructureRenderer", new MySmilesStructureRenderer());
    builder.registerRenderer("myBarCellRenderer", new BarCellRenderer(true));
    builder.registerColumnType("mySmilesStructureColumn", StructureImageColumn);
    builder.sidePanel(true, true); // collapse side panel by default
    builder.livePreviews({
        filter: false
    });
    builder.dynamicHeight(myDynamicHeight);
    

    return builder;
}

export interface IStructureFilter extends IStringFilter {
    filter: string;
    valid: Set<string>;
}
export class StructureImageColumn extends StringColumn {
  protected structureFilter: IStructureFilter | null = null;
  filter(row: IDataRow): boolean {
    if (!this.isFiltered()) {
      return true;
    }
    return this.structureFilter!.valid.has(this.getLabel(row));
  }
  isFiltered(): boolean {
    return this.structureFilter != null && this.structureFilter.valid?.size > 0;
  }
  getFilter() {
      return this.structureFilter;
  }
  setFilter(filter: IStructureFilter | null) {
    if (equal(filter, this.structureFilter)) {
      return;
    }
    this.fire([StringColumn.EVENT_FILTER_CHANGED, Column.EVENT_DIRTY_VALUES, Column.EVENT_DIRTY], this.structureFilter, this.structureFilter = filter);
  }
}



export class MySmilesStructureRenderer implements ICellRendererFactory {
    readonly title: string = 'Compound Structure';
    // better with background image, because with img tag the user might drag the img when they actually want to select several rows
    readonly template = '<div style="background-size: contain; background-position: center; background-repeat: no-repeat;"></div>';
    
    canRender(col: StructureImageColumn, mode: ERenderMode): boolean {
        return col instanceof StructureImageColumn && (mode === ERenderMode.CELL || mode === ERenderMode.GROUP);
    }
  
    create(col: StructureImageColumn): ICellRenderer {
        return {
            template: this.template,
            update: (n: HTMLImageElement, d: IDataRow) => {
                // @ts-ignore
                let smiles = d.v[col.desc.column];
                backend_utils.get_structure_from_smiles(smiles)
                .then(x => {
                    if(x.length > 100){ // check if it is actually long enogh to be an img
                        n.style.backgroundImage = `url('data:image/jpg;base64,${x}')`;
                    }else{
                        n.innerHTML = x;
                    }
                    n.alt = smiles;
                });
            }
        };
    }
  
    createGroup(col: StructureImageColumn, context: IRenderContext): IGroupCellRenderer {
        return {
            template: this.template,
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
                        .then(x => {
                            n.style.backgroundImage = `url('data:image/jpg;base64,${x}')`;
                            n.alt = formData.getAll("smiles_list").toString();
                        });
                    });
            }
          };
    }
  

  }

// export const LineUpContext_old = connector(function ({ lineUpInput, currentAggregation, setCurrentAggregation, onFilter }: Props) {
//     // In case we have no input, dont render at all
//     if (!lineUpInput || !lineUpInput.data || !lineUpInput.show) {
//         return null;
//     }
//     lineUpInput.data.forEach(element => {
//         if(element["clusterLabel"].length <= 0){
//             element["clusterLabel"] = [-1];
//         }
//     });

//     let ref = React.useRef()
//     React.useEffect(() => {
//         // @ts-ignore
//         const lineup = ref.current.adapter.instance;
//         const ranking = lineup.data.getFirstRanking();

//         // make lineup filter interact with the scatter plot view
//         ranking.on('orderChanged.custom', (previous, current, previousGroups, currentGroups, dirtyReason) => {
            
//             if (dirtyReason.indexOf('filter') === -1) {
//                 return;
//             }

//             const onRankingChanged = (current) => {
//                 for (let i=0; i < lineUpInput.data.length; i++) {
//                     lineUpInput.data[i].view.lineUpFiltered = !current.includes(i);
//                 }

//                 onFilter()

//             }

//             onRankingChanged(current)

//         })

        
//         // make lineup selection interact with the scatter plot view
//         lineup.on('selectionChanged', e => {
//             const currentSelection_lineup = lineup.getSelection();
//             if(currentSelection_lineup.length == 0) return; // selectionChanged is called during creation of lineup, before the current aggregation was set; therefore, it would always set the current aggregation to nothing because in the lineup table nothing was selected yet
            
//             const currentSelection_scatter = lineUpInput.data.map((x,i) => {if(x.view.selected) return i;}).filter(x => x !== undefined);
            
//             if(!arrayEquals(currentSelection_lineup, currentSelection_scatter)){ // need to check, if the current lineup selection is already the current aggregation
//                 let agg = [];
//                 currentSelection_lineup.forEach(index => {
//                     agg.push(lineUpInput.data[index]);
//                 })

//                 setCurrentAggregation(agg);
                
//             }
//         });



//         // update lineup when smiles_column width changes
//         if(smiles_col){
//             const lineup_smiles_col = ranking.columns.find(x => x.label == smiles_col);
//             if(lineup_smiles_col)
//                 lineup_smiles_col.on("widthChanged", (prev, current) => {
//                     lineup.update()
//                 });
//         }

//     }, [lineUpInput.data])

//     // this effect is allways executed after the component is rendered when currentAggregation changed
//     React.useEffect(() => {
//         // @ts-ignore
//         const lineup = ref.current.adapter.instance;
//         const ranking = lineup.data.getFirstRanking();

        
//         // select those instances that are also selected in the scatter plot view
//         if(currentAggregation && currentAggregation.length > 0){
//             const currentSelection_scatter = lineUpInput.data.map((x,i) => {if(x.view.selected) return i;}).filter(x => x !== undefined);
//             lineup.setSelection(currentSelection_scatter);

//             // add selection checkbox column
//             let selection_col = ranking.columns.find(x => x.label == "Selection Checkboxes");
//             if(!selection_col){
//                 selection_col = lineup.data.create(createSelectionDesc());
//                 if(selection_col){
//                     ranking.insert(selection_col, 1);
//                 }
//             }
//             // set the grouping to selection checkboxes
//             ranking.groupBy(selection_col, -1) // remove grouping first
//             ranking.groupBy(selection_col);
//         }

        

//     }, [currentAggregation])

//     let cols = lineUpInput.columns;

//     let lineup_col_list = [];

//     for (const i in cols) {
//         let col = cols[i];
//         let show = true; //!!not working yet for lineup react!! //!(typeof col.metaInformation.hideLineUp !== 'undefined' && col.metaInformation.hideLineUp); // hide column if "noLineUp" is specified

//         if(!EXCLUDED_COLUMNS.includes(i) && (Object.keys(col.metaInformation).length <= 0 || !col.metaInformation.noLineUp)){ // only if there is a "noLineUp" modifier at this column or thix column is excluded, we don't do anything
//             // lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} visible={show} width={50} />)    
//             if(col.metaInformation.imgSmiles){
//                 smiles_col = "Structure";
//                 lineup_col_list.push(<LineUpStringColumnDesc key={smiles_col} column={i} label={smiles_col} visible={true} renderer="mySmilesStructureRenderer" groupRenderer="mySmilesStructureRenderer" width={80} />) // summaryRenderer="mySmilesStructureRenderer"
//                 // lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} visible={show} />)
//             }
//             if(typeof col.featureType !== 'undefined'){
//                 switch(col.featureType){
//                     case FeatureType.Categorical:
//                         lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} visible={show} width={50} />);
//                         break;
//                     case FeatureType.Quantitative:
//                         lineup_col_list.push(<LineUpNumberColumnDesc key={i} column={i} visible={show} />);
//                         break;
//                     case FeatureType.Date:
//                         lineup_col_list.push(<LineUpDateColumnDesc key={i} column={i} visible={show} />);
//                         break;
//                     default:
//                         break;

//                 }
//             }else{
//                 if(col.isNumeric)
//                     // lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} visible={show} />);
//                     lineup_col_list.push(<LineUpNumberColumnDesc key={i} column={i} domain={[col.range.min, col.range.max]} visible={show} />);
//                 else if(col.distinct)
//                     if(col.distinct.length/lineUpInput.data.length <= 0.5) // if the ratio between distinct categories and nr of data points is less than 1:2, the column is treated as a string
//                         lineup_col_list.push(<LineUpCategoricalColumnDesc key={i} column={i} categories={col.distinct} visible={show} />)
//                     else
//                         lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} visible={show} width={50} />)
//                 else
//                     lineup_col_list.push(<LineUpStringColumnDesc key={i} column={i} visible={show} />)
//             }
            

//         }
//     }

//     lineup_col_list.push(<LineUpStringColumnDesc editable={true} column={"Annotations"} key={"annotations"} visible={true} />)
    
//     return <div className="LineUpParent">
//         {/* livePreviews={false} deriveColumns deriveColors  */}
//         <LineUp sidePanelCollapsed={true} livePreviews={{'filter': false}} ref={ref} data={lineUpInput.data} dynamicHeight={myDynamicHeight} renderers={{mySmilesStructureRenderer: new MySmilesStructureRenderer()}} defaultRanking={true} deriveColors> 
//             {lineup_col_list}
//         </LineUp>
//     </div>
// })
