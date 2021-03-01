import * as React from 'react';
import './chem.scss';
import * as backend_utils from '../../../utils/backend-connect';
import { Box, Button, Checkbox, FormControlLabel, Grid, InputAdornment, MenuItem, Select, TextField, Tooltip } from '@material-ui/core';
import { trackPromise } from "react-promise-tracker";
import { LoadingIndicatorView } from "../../Utility/Loaders/LoadingIndicator";
import { RootState } from '../../Store/Store';
import { connect, ConnectedProps } from 'react-redux';
import { BiRefresh } from 'react-icons/bi';
import useCancellablePromise, { makeCancelable } from '../../../utils/promise-helpers';
import FilterListIcon from '@material-ui/icons/FilterList';
import { setAggregationAction } from '../../Ducks/AggregationDuck';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';

/**
 * Chem Legend, implemented
 */

const mapStateToProps_Chem = (state: RootState) => ({
    dataset: state.dataset
})
const mapDispatchToProps_Chem = dispatch => ({

})
const connector_Chem = connect(mapStateToProps_Chem, mapDispatchToProps_Chem);


/**
 * Type that holds the props we declared above in mapStateToProps and mapDispatchToProps
 */
type PropsFromRedux_Chem = ConnectedProps<typeof connector_Chem>

type Props_Chem = PropsFromRedux_Chem & {
    selection: any, 
    columns: any, 
    aggregate: boolean, 
    hoverUpdate
}


const loading_area = "chemlegend_loading_area";
const UPDATER = "chemdetail";
export const ChemLegend = connector_Chem(class extends React.Component<Props_Chem, {rep_list: string[], current_rep: any, cancelables: any[]}>{

    constructor(props){
        super(props);
        this.state = {
            rep_list: ["Common Substructure"],
            current_rep: "Common Substructure",
            cancelables: []
        };
        this.loadRepList = this.loadRepList.bind(this);

    }

    componentDidMount(){
        this.loadRepList();
    }

    
    componentWillUnmount(){
        this.state.cancelables.forEach(p => p.cancel());
        this.setState({...this.state, cancelables: []});
    }

    loadRepList(refresh=false){
        if(refresh || this.state.rep_list.length <= 1){
            const cancelable = makeCancelable(backend_utils.get_representation_list(refresh, this.props.dataset.info.path));
            this.setState({...this.state, cancelables: this.state.cancelables.concat(cancelable)});
            cancelable.promise.then(x => {
                if(x["rep_list"].length > 0){
                    let rep_list = [...x["rep_list"]];
                    rep_list.splice(0, 0, "Common Substructure");
                    this.setState({...this.state, rep_list: rep_list});
                }
            })
        }
    }
    
    

    render(){

        const handleMouseEnter = (i) => {
            let hover_item = null;
            if(i >= 0){
                hover_item = this.props.selection[i];
            }
            this.props.hoverUpdate(hover_item, UPDATER);
        };

        const handleMouseOut = () => {
            let hover_item = null;
            this.props.hoverUpdate(hover_item, UPDATER);
        };

        if (this.props.aggregate) {
            return <div className={"ParentChem"}>
                <RepresentationList 
                    value={this.state.current_rep} 
                    onChange={(value) => {
                        // let selected = event.target.value;
                        if(this.state.rep_list.includes(value)){
                            this.setState({...this.state, current_rep: value});
                        }
                    }}
                    rep_list={this.state.rep_list}
                />
                <LoadingIndicatorView area={loading_area}/>
                <ImageView selection={this.props.selection} columns={this.props.columns} aggregate={this.props.aggregate} current_rep={this.state.current_rep} handleMouseEnter={handleMouseEnter} handleMouseOut={handleMouseOut} refreshRepList={this.loadRepList} />
                
                </div>;
        }

        return <div><ImageView selection={this.props.selection} columns={this.props.columns} aggregate={this.props.aggregate}/></div>;
    }
});


function loadImage(props, setComp, handleMouseEnter, handleMouseOut, cancellablePromise, checkedList, setCheckedList){ 
    let smiles_col = "SMILES";

    const onUpdateItem = (i, val) => {
        setCheckedList((checkedList) => {
            const list = checkedList.map((item, j) => {
                if (j === i) {
                  return val;
                } else {
                  return item;
                }
            });
            return list;
        });
    };

    // TODO: find by meta_data -> how to handle multiple smiles columns?
    // for (const col_name in props.columns) {
    //     let col = props.columns[col_name];
    //     if(col.metaInformation.imgSmiles)
    //         smiles_col = col_name;
    // }
    if(smiles_col in props.columns){
        setComp(<div></div>);
        if(props.selection.length > 0){
            
            if (props.aggregate) {
                const formData = new FormData();
                formData.append('current_rep', props.current_rep);
                props.selection.forEach(row => {
                    formData.append('smiles_list', row[smiles_col]);
                });
                const controller = new AbortController();
                trackPromise(
                    cancellablePromise(backend_utils.get_structures_from_smiles_list(formData, controller), controller).then(x => {
                        // @ts-ignore
                        //const img_lst = x["img_lst"].map((svg,i) => svg)
                        const img_lst = x["img_lst"].map((base64,i) => {
                            
                            setCheckedList((checkedList) => {
                                let cpy_checked_list = [...checkedList];
                                if(cpy_checked_list.length <= i){
                                    cpy_checked_list.push(false);
                                }
                                return cpy_checked_list;
                            });
                            return <Grid className={"legend_multiple"} key={i} item>
                                <FormControlLabel
                                    labelPlacement="bottom"
                                    control={<Checkbox checked={checkedList[i]} onChange={(event) => { onUpdateItem(i, event.target.checked); }} />}
                                    label={<img 
                                        src={"data:image/jpeg;base64," + base64} 
                                        onMouseEnter={() => {handleMouseEnter(i);}} 
                                        onMouseOver={() => {handleMouseEnter(i);}} 
                                        onMouseLeave={() => {handleMouseOut();}}
                                        />}
                                    />
                                
                            </Grid>
                        }) //key={props.selection[i][smiles_col]} --> gives error because sometimes smiles ocure twice
                        //<div dangerouslySetInnerHTML={{ __html: img_lst.join("") }} />
                        setComp(img_lst);
                    })
                , loading_area);
            }else{
                let row = props.selection[0]; 
                const controller = new AbortController();
                cancellablePromise(backend_utils.get_structure_from_smiles(row[smiles_col], false, controller), controller).then(x => {
                    setComp(<img className={"legend_single"} src={"data:image/jpeg;base64," + x}/>)
                }).catch(error => console.log(error));
            }
        }else{
            setComp(<div>No Selection</div>);
        }
    }else{
        setComp(<div>No SMILES column found</div>);
    }
}

function updateImage(props, cancellablePromise){ 
    let smiles_col = "SMILES";
    // TODO: find by meta_data -> how to handle multiple smiles columns?

    if(smiles_col in props.columns){
        let imgList = props.imgContainer.childNodes;
        if(props.selection.length == imgList.length){
            const formData = new FormData();
            formData.append('current_rep', props.current_rep);
            props.selection.forEach(row => {
                formData.append('smiles_list', row[smiles_col]);
            });
            const controller = new AbortController();
            trackPromise(
                cancellablePromise(backend_utils.get_structures_from_smiles_list(formData, controller), controller).then(x => {
                    x["img_lst"].map((base64,i) => {
                        const cur_img = imgList[i].getElementsByTagName("img")[0];
                        cur_img.src = "data:image/jpeg;base64," + base64;
                    });
                })
            , loading_area);
            
        }
    }
}

const mapStateToProps_Img = (state: RootState) => ({
    hoverState: state.hoverState
})
const mapDispatchToProps_Img = dispatch => ({
    setCurrentAggregation: samples => dispatch(setAggregationAction(samples))
})
const connector_Img = connect(mapStateToProps_Img, mapDispatchToProps_Img);


/**
 * Type that holds the props we declared above in mapStateToProps and mapDispatchToProps
 */
type PropsFromRedux_Img = ConnectedProps<typeof connector_Img>

type Props_Img = PropsFromRedux_Img & {
    selection,
    columns,
    aggregate,
    handleMouseEnter?,
    handleMouseOut?,
    current_rep?,
    refreshRepList?
}

function addHighlight(element){
    if(element && element.style){
        element.style["border"] = "solid black 1px";
    }
}

function removeHighlight(element){
    if(element && element.style){
        element.style["border"] = "solid white 1px";
    }
}

const ImageView = connector_Img(function ({ hoverState, selection, columns, aggregate, handleMouseEnter, handleMouseOut, current_rep, setCurrentAggregation, refreshRepList }: Props_Img) {
    const [comp, setComp] = React.useState(<div></div>);
    const [checkedList, setCheckedList] = React.useState([]);

    const ref = React.useRef()
    const { cancellablePromise, cancelPromises } = useCancellablePromise();

    React.useEffect(() => {
        cancelPromises(); // cancel all unresolved promises
    }, [selection, current_rep])

    React.useEffect(() => {
        setCheckedList([]);
        loadImage({columns: columns, aggregate: aggregate, current_rep: current_rep, selection: selection}, setComp, handleMouseEnter, handleMouseOut, cancellablePromise, checkedList, setCheckedList); 
    }, [selection])

    React.useEffect(() => {
        if(aggregate)
            updateImage({columns: columns, current_rep: current_rep, selection: selection, imgContainer: ref?.current}, cancellablePromise); 
    }, [current_rep]);
    
    React.useEffect(() => {
        if(aggregate){
            //@ts-ignore
            let imgContainer = ref?.current;
            //@ts-ignore
            let imgList = imgContainer.childNodes;
            if(hoverState && hoverState.data){
                const idx = selection.findIndex((x) => x && x["__meta__"] && hoverState.data["__meta__"] && x["__meta__"]["view"]["meshIndex"] == hoverState.data["__meta__"]["view"]["meshIndex"])
                if(idx >= 0 && imgList.length > 0){
                    for (const i in imgList) {
                        const img_div = imgList[i];
                        removeHighlight(img_div);
                    }
                    addHighlight(imgList[idx]);
                    
                    if(hoverState.updater != UPDATER){
                        if(imgContainer && imgList[idx])
                            //@ts-ignore
                            imgContainer.scrollTop = imgList[idx].offsetTop - imgContainer.offsetTop;
                            // imgList[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
                    }
                }
            }else{
                for (const i in imgList) {
                    const img_div = imgList[i];
                    removeHighlight(img_div);
                }
            }
        }
    }, [hoverState]);


    const handle_filter = () => {
        const filter_instances = selection.filter((x, i) => checkedList[i]);
        setCheckedList([]);
        setCurrentAggregation(filter_instances);
    }

    return <div className={"chemContainer"}>
            <Grid ref={ref} className={"chem-grid"} container>{comp}</Grid>
            {aggregate && <Box paddingLeft={2} paddingTop={2}>
                <Button 
                    size="small"
                    variant="outlined"
                    onClick={() => {handle_filter()}}><FilterListIcon fontSize={"small"}/>&nbsp;Confirm Selection</Button>

                <Tooltip title="Refresh Representation List">
                    <Button aria-label={"Refresh Representation List"} onClick={() => refreshRepList(true)}><BiRefresh/></Button>
                </Tooltip>
            </Box>}
        </div>;
});

const RepresentationList = props => {

    const options = props.rep_list.map((rep) => {
        let split = rep.split('.');
        const inputVal = split.pop();
        const group = split.join('.');
        return {
            group: group,
            value: rep,
            inputValue: inputVal
        };
    });

    const filterOptions = createFilterOptions({
        stringify: (option:any) => { return option.value; },
    });

    return <Box paddingLeft={1}>
        <Autocomplete
            filterOptions={filterOptions}
            onChange={(event, newValue) => {
                if(newValue)
                    props.onChange(newValue.value);
            }}
            disablePortal={true}
            id="vectorRep"
            options={options}
            groupBy={(option:any) => option.group}
            getOptionLabel={(option:any) => option.inputValue}
            getOptionSelected={(option:any, value) => {return option.value == value.value;}}
            // style={{ width: 215, float:'left' }}
            // defaultValue={options[0]}
            
            renderInput={(params) => <TextField {...params} label="Choose Representation" variant="outlined" />}
        />
        
        
    </Box>
};
