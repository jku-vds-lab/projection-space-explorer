import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../Store/Store";
import * as LineUpJS from 'lineupjs'
import './LineUpContext.scss';
import { IStringFilter, equal, createSelectionDesc, Column, ERenderMode, IDynamicHeight, IGroupItem, Ranking, IRenderContext, IOrderedGroup, ICellRenderer, ICellRendererFactory, IDataRow, IGroupCellRenderer, renderMissingDOM, StringColumn } from "lineupjs";
import * as backend_utils from "../../utils/backend-connect";
import { EXCLUDED_COLUMNS, PrebuiltFeatures } from "../../model/Dataset";
import { setLineUpInput_lineup, setLineUpInput_visibility } from "../Ducks/LineUpInputDuck";
import { MyWindowPortal } from "../Overlays/WindowPortal/WindowPortal";
import * as _ from 'lodash';
import { ACluster } from "../../model/Cluster";
import { selectVectors } from "../Ducks/AggregationDuck";
import { ShallowSet } from "../Utility/ShallowSet";
import { TestColumn } from "./LineUpClasses/TestColumn";
import { DiscreteMapping } from "../Utility/Colors/Mapping";
import { StoriesUtil } from "../Ducks/StoriesDuck";
import { setHoverState } from "../Ducks/HoverStateDuck";
console.log(equal)
/**
 * Declares a function which maps application state to component properties (by name)
 * 
 * @param state The whole state of the application (contains a field for each duck!)
 */
const mapStateToProps = (state: RootState) => ({
    lineUpInput: state.lineUpInput,
    lineUpInput_data: state.dataset?.vectors,
    lineUpInput_columns: state.dataset?.columns,
    currentAggregation: state.currentAggregation,
    activeStory: StoriesUtil.getActive(state.stories),
    pointColorScale: state.pointColorScale,
    channelColor: state.channelColor
    // splitRef: state.splitRef
    //hoverState: state.hoverState
})


/**
 * Declares a function which maps dispatch events to component properties (by name)
 * 
 * @param dispatch The generic dispatch function declared in redux
 */
const mapDispatchToProps = dispatch => ({
    setCurrentAggregation: (samples: number[]) => dispatch(selectVectors(samples)),
    setLineUpInput_visibility: visibility => dispatch(setLineUpInput_visibility(visibility)),
    setLineUpInput_lineup: input => dispatch(setLineUpInput_lineup(input)),
    setHoverstate: (state, updater) => dispatch(setHoverState(state, updater))
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
    onFilter
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}


// let lineup = null;
const UPDATER = "lineup";
const UNIQUE_ID = "unique_ID";

/**
 * Our component definition, by declaring our props with 'Props' we have static types for each of our property
 */
export const LineUpContext = connector(function ({ 
    lineUpInput, 
    lineUpInput_data, 
    lineUpInput_columns, 
    currentAggregation, 
    channelColor,
    setCurrentAggregation, 
    setLineUpInput_lineup, 
    setLineUpInput_visibility, 
    onFilter, 
    activeStory, 
    pointColorScale,
    setHoverstate
     }: Props) {
    // In case we have no input, dont render at all
    if (!lineUpInput || !lineUpInput_data || !lineUpInput.show) {
        //splitRef?.current?.setSizes([100, 0])
        return null;
    }
    let lineup_ref = React.useRef();
    

    const debouncedHighlight = React.useCallback(_.debounce(hover_item => setHoverstate(hover_item, UPDATER), 200), []);

    const preprocess_lineup_data = (data) => {
        if(activeStory)
            ACluster.deriveVectorLabelsFromClusters(data, Object.values(activeStory.clusters.byId))
        let lineup_data = [];
        let columns = {};
        data.forEach(element => {
            // if(element[PrebuiltFeatures.ClusterLabel].length <= 0){
            //     element[PrebuiltFeatures.ClusterLabel] = [-1];
            // }

            let row = {}

            for (const i in lineUpInput_columns) {
                let col = lineUpInput_columns[i];

                if (!EXCLUDED_COLUMNS.includes(i) && (Object.keys(col.metaInformation).length <= 0 || !col.metaInformation.noLineUp)) {
                    if(Object.keys(col.metaInformation).length > 0 && col.metaInformation.lineUpGroup){
                        // if(col.metaInformation.lineUpGroup.endsWith(""))
                        const split = col.metaInformation.lineUpGroup.split("_"); 
                        if(split.length <=1){ // if the string is separated with and underscore, only the first part of the string is considered as the group. the second part of the string determines a sub value of this group
                            if(Object.keys(row).includes(col.metaInformation.lineUpGroup)){
                                row[col.metaInformation.lineUpGroup].push(element[i])
                            }else{
                                row[col.metaInformation.lineUpGroup] = [element[i]]
                                columns[col.metaInformation.lineUpGroup] = col;
                            }
                        }else{
                            const group_name = split[0];
                            const var_name = split[1];
                            if(Object.keys(row).includes(group_name)){
                                if(Object.keys(row[group_name]).includes(var_name)){
                                    row[group_name][var_name].push(element[i]);
                                }else{
                                    row[group_name][var_name] = [element[i]];
                                }
                            }else{
                                row[group_name] = {};
                                row[group_name][var_name] = [element[i]];

                            }

                            // update column metaInformation
                            if(Object.keys(columns).includes(group_name)){
                                columns[group_name].metaInformation.globalMin = Math.min(columns[group_name].metaInformation.globalMin, element[i]);
                                columns[group_name].metaInformation.globalMax = Math.max(columns[group_name].metaInformation.globalMax, element[i]);
                            }else{
                                columns[group_name] = col;
                                columns[group_name].metaInformation.customLineChart = true;
                                columns[group_name].metaInformation.globalMin = element[i];
                                columns[group_name].metaInformation.globalMax = element[i];
                            }
                        }
                    }else{
                        row[i] = element[i];
                        columns[i] = col;
                    }
                }

            }

            row[PrebuiltFeatures.ClusterLabel] = element[PrebuiltFeatures.ClusterLabel].toString();
            row[UNIQUE_ID] = element["__meta__"]["meshIndex"];
            lineup_data.push(row);

            // console.log(element)
            // let row = Object.assign({}, element)
            // row[PrebuiltFeatures.ClusterLabel] = element[PrebuiltFeatures.ClusterLabel].toString();
            // row[UNIQUE_ID] = element["__meta__"]["view"]["meshIndex"];
            // lineup_data.push(row);
        });

        return [lineup_data, columns];
    }

    const clear_automatic_filters = (lineUpInput, filter) => {
        if (filter) {
            for (const key in filter) {
                const lineup = lineUpInput.lineup;
                const ranking = lineup.data.getFirstRanking();
                if (key === 'selection') {
                    const filter_col = ranking.children.find(x => { return x.desc.column == UNIQUE_ID; });
                    filter_col?.clearFilter()
                } else {
                    const filter_col = ranking.children.find(x => { return x.desc.column == key; });
                    filter_col?.clearFilter()
                }
            }

        }
    }
    const get_lineup_dump = (lineUpInput) => {
        if(lineUpInput.lineup){
            clear_automatic_filters(lineUpInput, lineUpInput.filter)
            const dump = lineUpInput.lineup.dump()
            return dump;
        }
        return null;
    }

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


        let temp_data = preprocess_lineup_data(lineUpInput_data);
        let lineup_data = temp_data[0];
        let columns = temp_data[1];

        const builder = buildLineup(columns, lineup_data, pointColorScale, channelColor); //lineUpInput_data
        let dump = get_lineup_dump(lineUpInput);

        lineUpInput.lineup?.destroy();
        let lineup = null;
        lineup = builder.buildTaggle(lineup_ref.current);
        console.log(lineup)
        if(dump){
            lineup.restore(dump);
        }
        

        const ranking = lineup.data.getFirstRanking();

        // add selection checkbox column
        let selection_col = ranking.children.find(x => x.label == "Selection Checkboxes");
        if (!selection_col) {
            selection_col = lineup.data.create(createSelectionDesc());
            if (selection_col) {
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
        lineup.on('selectionChanged', currentSelection_lineup => {
            // if(currentSelection_lineup.length == 0) return; // selectionChanged is called during creation of lineup, before the current aggregation was set; therefore, it would always set the current aggregation to nothing because in the lineup table nothing was selected yet
            
            const currentSelection_scatter = lineUpInput_data.map((x,i) => {if(x.__meta__.selected) return i;}).filter(x => x !== undefined);
            
            if(!arrayEquals(currentSelection_lineup, currentSelection_scatter)){ // need to check, if the current lineup selection is already the current aggregation
                let agg = new Array<number>();
                currentSelection_lineup.forEach(index => {
                    agg.push(lineUpInput_data[index].__meta__.meshIndex);
                })

                setCurrentAggregation(agg);
            }
        });

        lineup.on('highlightChanged', idx => {
            let hover_item = null;
            if (idx >= 0) {
                hover_item = lineUpInput_data[idx];
            }
            debouncedHighlight(hover_item);
        });

        // update lineup when smiles_column width changes
        if (smiles_structure_columns.length > 0 || custom_chart_columns.length > 0) {
            const custom_chart_cols = ranking.children.filter(x => custom_chart_columns.includes(x.label));
            for (const i in custom_chart_cols) {
                let custom_chart_col = custom_chart_cols[i];
                custom_chart_col.on("widthChanged", (prev, current) => {
                    lineup.update()
                });
            }


            const lineup_smiles_cols = ranking.children.filter(x => smiles_structure_columns.includes(x.label));
            for (const i in lineup_smiles_cols) {
                let lineup_smiles_col = lineup_smiles_cols[i];
                lineup_smiles_col.on("widthChanged", (prev, current) => {
                    lineup.update()
                });

                // custom filter adapted from michael
                const filterChanged = (prev, cur: IStringFilter) => {
                    if(prev?.filter !== cur?.filter){ // only update, if it is a new filter
                        const filter = typeof(cur?.filter) === 'string' ? cur?.filter : null; // only allow string filters -> no regex (TODO: remove regex checkbox)
                        if(lineup_smiles_col && filter) {
                            backend_utils.get_substructure_count(lineUpInput_data.map((d) => d[lineup_smiles_col.desc.column]), filter).then((matches) => {
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

    }, [lineUpInput_data, lineUpInput_columns, activeStory, activeStory?.clusters, activeStory?.clusters?.allIds.length, lineUpInput.update]);

    // React.useEffect(() => { //TODO: not working...
    //     // update lineup, if current storybook (current cluster) changed
    //     if(lineUpInput.lineup){
    //         const data_provider = lineUpInput.lineup.data;
    //         let lineup_data = preprocess_lineup_data(lineUpInput_data);
    //         console.log("setdata")
    //         data_provider.setData(lineup_data);

    //         const ranking = lineUpInput.lineup.data.getFirstRanking();
    //         const my_col_builder = LineUpJS.buildCategoricalColumn(PrebuiltFeatures.ClusterLabel);
    //         console.log(lineup_data)
    //          ranking.insert(lineUpInput.lineup.data.create(my_col_builder.build(lineup_data)));
    //         ranking.insert(lineUpInput.lineup.data.create(my_col_builder.build([]])));

    //         // const ranking = lineUpInput.lineup.data.getFirstRanking();
    //         // // let cluster_col = ranking.columns.find(x => x.desc.column == PrebuiltFeatures.ClusterLabel);
    //         // // const my_desc = cluster_col.desc;
    //         // // my_desc.categories = ["test"]
    //         // // const my_col = new CategoricalColumn(cluster_col.id, cluster_col.desc)
    //         // const my_col_builder = LineUpJS.buildCategoricalColumn(PrebuiltFeatures.ClusterLabel);
    //         // // console.log()
    //         // ranking.insert(lineUpInput.lineup.data.create(my_col_builder.build(lineup_data))); //asSet(',')
            
    //         // // data_provider.setData(lineup_data)
    //         // // lineUpInput.lineup.update();
    //         // // lineUpInput.lineup?.setDataProvider(data_provider);
    //         // lineUpInput.lineup.restore(lineUpInput.lineup.dump())

    //         // // console.log(cluster_col.dump())
    //         // // console.log(lineUpInput.lineup.dump())
            
    //     }
    // }, [activeStory, activeStory?.clusters, activeStory?.clusters?.length]);


    // this effect is allways executed after the component is rendered when currentAggregation changed
    React.useEffect(() => {

        if (lineUpInput.lineup != null) {

            // select those instances that are also selected in the scatter plot view
            if (currentAggregation.aggregation && currentAggregation.aggregation.length > 0) {
                const currentSelection_scatter = lineUpInput_data.map((x, i) => { if (x.__meta__.selected) return i; }).filter(x => x !== undefined);
                lineUpInput.lineup.setSelection(currentSelection_scatter);

                // const lineup_idx = lineup.renderer?.rankings[0]?.findNearest(currentSelection_scatter);
                // lineup.renderer?.rankings[0]?.scrollIntoView(lineup_idx);

                // set the grouping to selection checkboxes -> uncomment if this should be automatically if something changes
                // const ranking = lineup.data.getFirstRanking();
                // let selection_col = ranking.children.find(x => x.label == "Selection Checkboxes");
                // ranking.groupBy(selection_col, -1) // remove grouping first
                // ranking.groupBy(selection_col);
            } else {
                lineUpInput.lineup.setSelection([]);
            }
        }

    }, [lineUpInput.lineup, currentAggregation])

    React.useEffect(() => {
        if (lineUpInput.lineup && lineUpInput.lineup.data) {
            const ranking = lineUpInput.lineup.data.getFirstRanking();
            clear_automatic_filters(lineUpInput, lineUpInput.previousfilter);
            if (lineUpInput.filter) {
                for (const key in lineUpInput.filter) {
                    const cur_filter = lineUpInput.filter[key];

                    if(key === 'reset' && cur_filter){
                        ranking.clearFilters();
                    }else if (key === 'selection') {
                        const filter_col = ranking.children.find(x => { return x.desc.column == UNIQUE_ID; });

                        let regex_str = "";
                        lineUpInput.filter[key].forEach(element => {
                            regex_str += "|"
                            regex_str += element["__meta__"]["meshIndex"]
                        });
                        regex_str = regex_str.substr(1); // remove the leading "|"
                        const my_regex = new RegExp(`^(${regex_str})$`, "i"); // i modifier says that it's not case sensitive; ^ means start of string; $ means end of string
                        filter_col?.setFilter({
                            filter: my_regex,
                            filterMissing: true
                        });
                    } else {
                        const filter_col = ranking.children.find(x => { return x.desc.column == key; });
                        const my_regex = new RegExp(`^(.+,)?${cur_filter}(,.+)?$`, "i"); // i modifier says that it's not case sensitive; ^ means start of string; $ means end of string
                        filter_col?.setFilter({
                            filter: my_regex,
                            filterMissing: true
                        });
                    }
                }

            }
            

        }
    }, [lineUpInput.lineup, lineUpInput.filter]);


    //https://github.com/lineupjs/lineup_app/blob/master/src/export.ts
    return false ?
        <MyWindowPortal onClose={() => { lineUpInput.lineup?.destroy(); setLineUpInput_visibility(false); }}>
            <div ref={lineup_ref} id="lineup_view"></div>
        </MyWindowPortal> :
        <div className="LineUpParent">
            <div><div ref={lineup_ref} id="lineup_view"></div></div>
        </div>
})


const WIDTH_HEIGHT_RATIO = 2;
let smiles_structure_columns = [];
let custom_chart_columns = [];
function myDynamicHeight(data: IGroupItem[], ranking: Ranking): IDynamicHeight {
    if (smiles_structure_columns.length > 0) {
        const cols = ranking.children.filter(x => smiles_structure_columns.includes(x.label) || custom_chart_columns.includes(x.label));
        
        if (!cols || cols.length == 0)
            return { defaultHeight: 25, height:() => 25, padding: () => 0};

        const col_heights = cols.map(x => { 
            if(custom_chart_columns.includes(x.label))
                return x.getWidth()/WIDTH_HEIGHT_RATIO; // for chart, the width should be bigger than the height
            return x.getWidth(); // for images it is square
        });
        const col_height = Math.max(Math.max(...col_heights), 25);//col.getWidth();

        let height = function (item: IGroupItem | Readonly<IOrderedGroup>): number {
            return col_height;
        }
        let padding = function (item: IGroupItem | Readonly<IOrderedGroup>): number {
            return 0;
        }
        return { defaultHeight: col_height, height: height, padding: padding };
    }
    return { defaultHeight: 25, height:() => 25, padding: () => 0};
}

// const base_color = undefined;
const base_color = "#c1c1c1";
// const base_color = "#1f77b4";
function buildLineup(cols, data, pointColorScale, channelColor) {
    // console.log(channelColor) //TODO: update lineup colorscale, if sth changes; TODO: do this for all columns, not just groupLabel
    let groupLabel_cat_color = null;
    if(channelColor.key === PrebuiltFeatures.ClusterLabel){
        let groupLabel_mapping = new DiscreteMapping(pointColorScale, new ShallowSet(data.map(vector => vector[PrebuiltFeatures.ClusterLabel])))
        groupLabel_cat_color = groupLabel_mapping.values
            .filter(cat => cat && cat !== "")
            .map(cat => {
                return {name: cat, color: groupLabel_mapping.map(cat).hex};
            })
    }
    
    const builder = LineUpJS.builder(data);

    for (const i in cols) {
        let col = cols[i];
        let show = true; //!(typeof col.metaInformation.hideLineUp !== 'undefined' && col.metaInformation.hideLineUp); // hide column if "hideLineUp" is specified -> there is a lineup bug with that option

        // if (!EXCLUDED_COLUMNS.includes(i) && (Object.keys(col.metaInformation).length <= 0 || !col.metaInformation.noLineUp)) { // only if there is a "noLineUp" modifier at this column or thix column is excluded, we don't do anything
            if (col.metaInformation.imgSmiles) {
                const smiles_col = "Structure: " + i;
                smiles_structure_columns.push(smiles_col);
                builder.column(LineUpJS.buildColumn("mySmilesStructureColumn", i).label(smiles_col).renderer("mySmilesStructureRenderer", "mySmilesStructureRenderer").width(50).build([]));

                builder.column(LineUpJS.buildStringColumn(i).width(50).custom("visible", show).color(base_color));
            } else if(col.metaInformation.customLineChart){
                // builder.column(LineUpJS.buildNumberColumn(i).label(i).asMap().renderer("myLineChartRenderer", "myLineChartRenderer").width(50).build([]));
                builder.column(LineUpJS.buildColumn("myLineChartColumn", i).label(i).custom("min", col.metaInformation.globalMin).custom("max", col.metaInformation.globalMax).renderer("myLineChartRenderer", "myLineChartRenderer").width(150).build([]));
                custom_chart_columns.push(i);
            } else if(i == PrebuiltFeatures.ClusterLabel){
                const clust_col = LineUpJS.buildCategoricalColumn(i, groupLabel_cat_color).custom("visible", show).width(70) // .asSet(',')
                builder.column(clust_col);
            } else{
                builder.deriveColumns(i);
            }

            // else if (typeof col.featureType !== 'undefined') {
            //     switch (col.featureType) {
            //         case FeatureType.Categorical:
            //             if (data && col.distinct && col.distinct.length / data.length <= 0.5) {
            //                 builder.column(LineUpJS.buildCategoricalColumn(i).custom("visible", show));
            //             } else {
            //                 builder.column(LineUpJS.buildStringColumn(i).width(50).custom("visible", show));
            //             }
            //             break;
            //         case FeatureType.Quantitative:
            //             builder.column(LineUpJS.buildNumberColumn(i).numberFormat(".2f").custom("visible", show).color(base_color));//.renderer("myBarCellRenderer")); //.renderer("numberWithValues")
            //             break;
            //         case FeatureType.Date:
            //             builder.column(LineUpJS.buildDateColumn(i).custom("visible", show).color(base_color));
            //             break;
            //         default:
            //             builder.column(LineUpJS.buildStringColumn(i).width(50).custom("visible", show).color(base_color));
            //             break;

            //     }
            // } else {
            //     if (col.isNumeric) {
            //         builder.column(LineUpJS.buildNumberColumn(i, [col.range.min, col.range.max]).numberFormat(".2f").custom("visible", show).color(base_color));//.renderer("myBarCellRenderer"));
            //     } else if (col.distinct)
            //         if (data && col.distinct.length / data.length <= 0.5) // if the ratio between distinct categories and nr of data points is less than 1:2, the column is treated as a string
            //             builder.column(LineUpJS.buildCategoricalColumn(i).custom("visible", show));
            //         else
            //             builder.column(LineUpJS.buildStringColumn(i).width(50).custom("visible", show).color(base_color));
            //     else
            //         builder.column(LineUpJS.buildStringColumn(i).width(50).custom("visible", show).color(base_color));
            // }
        // }
    }

    // builder.deriveColumns([]);

    builder.column(LineUpJS.buildStringColumn("Annotations").editable().color(base_color))
    builder.column(LineUpJS.buildStringColumn(UNIQUE_ID).width(50).color(base_color)); // we need this to be able to filter by all indices; this ID corresponds to the mesh index

    builder.defaultRanking(true);
    // builder.deriveColors();
    builder.registerRenderer("mySmilesStructureRenderer", new MySmilesStructureRenderer());
    builder.registerRenderer("myLineChartRenderer", new MyLineChartRenderer());
    // builder.registerRenderer("myBarCellRenderer", new BarCellRenderer(true));
    builder.registerColumnType("mySmilesStructureColumn", StructureImageColumn);
    builder.registerColumnType("myLineChartColumn", TestColumn); 
    builder.sidePanel(true, true); // collapse side panel by default
    builder.livePreviews({
        filter: false
    });
    builder.dynamicHeight(myDynamicHeight);
    builder.animated(false);

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



export class MyLineChartRenderer implements ICellRendererFactory {
    readonly title: string = 'Line Chart';

    canRender(col: TestColumn, mode: ERenderMode): boolean {
        // return col instanceof NumberColumn && (mode === ERenderMode.CELL);
        return mode === ERenderMode.CELL;
    }

    

    create(col: TestColumn): ICellRenderer {
        return {
            template: `<div class="svg-container"><svg class="svg-content" preserveAspectRatio="xMidYMid meet"><g><path class="areaChart"></path><path class="lineChart" fill="none" stroke="${base_color}" stroke-width="0.02px"></path><g><line class="focus-line"></line></g><g><text style="font-size:0.2px;" class="focus-text"></text></g><rect class="hover-rect"></rect></g></svg></div>`,
            update: (n: HTMLImageElement, d: IDataRow) => {
                if (renderMissingDOM(n, col, d)) {
                    return;
                }

                var d3 = require('d3');
                // get data
                let row = col.getMap(d);
                const data_mean_list = row[0]["value"];
                const data_var_list = row[1]["value"];
                // const data_max = col.getMax();
                const data_max = d3.max(data_mean_list, function(d) { return +d; })+1;
                // const data_min = col.getMin();
                const data_min = d3.min(data_mean_list, function(d) { return +d; })-1;

                // this is the ratio that the chart should have
                const rel_width = WIDTH_HEIGHT_RATIO; //data_mean_list.length/4;
                const rel_height = 1;

                var div = d3.select(n);
                var svg = div.select("svg");
                svg.attr("viewBox", `0 0 ${rel_width} ${rel_height}`);

                // define x and y scales
                var x = d3.scaleTime()
                    .domain([0, data_mean_list.length])
                    .range([ 0, rel_width ]);

                var y = d3.scaleLinear()
                    .domain([data_min, data_max])
                    .range([ rel_height, 0 ]);


                // Show confidence interval
                svg.select(".areaChart")
                    .datum(data_var_list)
                    .attr("fill", "#c1c1c14d")
                    .attr("stroke", "none")
                    .attr("d", d3.area()
                        .x(function(d, i) { return x(i) })
                        .y0(function(d, i) { return y(data_mean_list[i] - d) })
                        .y1(function(d, i) { return y(data_mean_list[i] + d) })
                    )


                // draw the line chart
                var path = svg.select(".lineChart");
                path.datum(data_mean_list).attr("d", d3.line()
                    .x(function(d, i) { return x(i) }) // i/data_list.length
                    .y(function(d) { return y(d) }) // 1-(d/data_max)
                )

                // add tooltips
                // https://www.d3-graph-gallery.com/graph/line_cursor.html
                // This allows to find the closest X index of the mouse:
                // var bisect = d3.bisector(function(d, i) { return i; }).left;

                // Create the line that travels along the x-axis of chart
                var focus = svg.select(".focus-line")
                    .style("fill", "none")
                    .attr("stroke", "black")
                    .attr('stroke-width', "1%")
                    .attr("y1", "0")
                    .attr("y2", rel_height)
                    .attr("x1", "0")
                    .attr("x2", "0")
                    .style("opacity", 0);

                // Create the text that travels along the curve of chart
                var focusText = svg.select(".focus-text")
                    .style("opacity", 0)
                    .attr("text-anchor", "left")
                    .attr("alignment-baseline", "middle")
                    .attr("letter-spacing", "0px")

                // Create a rect on top of the svg area: this rectangle recovers mouse position
                svg.select(".hover-rect")
                    .style("fill", "none")
                    .style("pointer-events", "all")
                    .attr('width', "100%")
                    .attr('height', "100%")
                    .on('mouseover', mouseover)
                    .on('mousemove', mousemove)
                    .on('mouseout', mouseout);


                // What happens when the mouse move -> show the annotations at the right positions.
                function mouseover() {
                    focus.style("opacity", 1)
                    focusText.style("opacity",1)
                }

                function mousemove() {
                    // recover coordinate we need
                    var x0 = d3.mouse(this)[0];
                    // var y0 = d3.mouse(this)[1];
                    // var i = bisect(data, x0, 1);
                    // var x0 = x.invert(d3.mouse(this)[0]);
                    var i = Math.round(x.invert(x0)); // x0*data_list.length

                    i = Math.max(i, 0);
                    i = Math.min(data_mean_list.length-1, i);

                    focus.attr("x1", x(i)) // i/data_list.length
                        .attr("x2", x(i)); // i/data_list.length

                    // // position the text in a way that it is always readable
                    // if(x0 > rel_width/2){
                    //     x0 = x0-rel_width/2;
                    // }
                    focusText
                        .html("<tspan x='0' dy='1.2em'>step: " + i + "</tspan><tspan x='0' dy='1.2em'>mean: " + Math.round(data_mean_list[i]*100)/100 + "</tspan><tspan x='0' dy='1.2em'>var: " + Math.round(data_var_list[i]*100)/100 + "</tspan>")
                        .attr("x", 0) //x0
                        .attr("y", 0); //y0
                    
                }

                function mouseout() {
                    focus.style("opacity", 0)
                    focusText.style("opacity", 0)
                }
            }
        };
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
                        if (x.length > 100) { // check if it is actually long enogh to be an img
                            n.style.backgroundImage = `url('data:image/jpg;base64,${x}')`;
                        } else {
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