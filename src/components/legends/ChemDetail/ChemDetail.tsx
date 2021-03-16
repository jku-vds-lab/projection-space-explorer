import * as React from 'react';
import './chem.scss';
import * as backend_utils from '../../../utils/backend-connect';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, IconButton, Input, InputAdornment, InputLabel, makeStyles, MenuItem, Paper, Popover, Select, Switch, TextField, Tooltip, Typography } from '@material-ui/core';
import { trackPromise } from "react-promise-tracker";
import { LoadingIndicatorView } from "../../Utility/Loaders/LoadingIndicator";
import { RootState } from '../../Store/Store';
import { connect, ConnectedProps } from 'react-redux';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import useCancellablePromise, { makeCancelable } from '../../../utils/promise-helpers';
import FilterListIcon from '@material-ui/icons/FilterList';
import { setAggregationAction } from '../../Ducks/AggregationDuck';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { isFunction } from 'lodash';
import { setRDKit_contourLines, setRDKit_refresh, setRDKit_scale, setRDKit_showMCS, setRDKit_sigma } from '../../Ducks/RDKitSettingsDuck';

/**
 * Chem Legend, implemented
 */

const mapStateToProps_Chem = (state: RootState) => ({
    dataset: state.dataset
})
const mapDispatchToProps_Chem = dispatch => ({
    setCurrentAggregation: samples => dispatch(setAggregationAction(samples))
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
export const ChemLegend = connector_Chem(class extends React.Component<Props_Chem, {rep_list: string[], current_rep: any, cancelables: any[], checkedList: boolean[], settingsOpen: boolean}>{
    anchorRef: any;

    constructor(props){
        super(props);
        this.state = {
            rep_list: ["Common Substructure"],
            current_rep: "Common Substructure",
            cancelables: [],
            checkedList: [],
            settingsOpen: false
        };
        this.loadRepList = this.loadRepList.bind(this);
        this.anchorRef = React.createRef();
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

        const setCheckedList = (value) => {
            const set_val = isFunction(value) ? value(this.state.checkedList) : value;
            this.setState({...this.state, checkedList: set_val});
        }
        
        const handle_filter = () => {
            const filter_instances = this.props.selection.filter((x, i) => this.state.checkedList[i]);
            setCheckedList([]);
            this.props.setCurrentAggregation(filter_instances);
        }

        const setSettingsOpen = (value) => {
            const set_val = isFunction(value) ? value() : value;
            this.setState({...this.state, settingsOpen: set_val});
        }
        const setCurrentRep = (value) => {
            if(this.state.rep_list.includes(value)){
                this.setState({...this.state, current_rep: value});
            }
        }

        if (this.props.aggregate) {
            return <div className={"ParentChem"}>
                        
                <Box paddingLeft={2} paddingTop={1} paddingRight={2}>
                    <RepresentationList 
                            value={this.state.current_rep}
                            onChange={setCurrentRep}
                            rep_list={this.state.rep_list}
                    />
                    <Button 
                        size="small"
                        variant="outlined"
                        onClick={() => {handle_filter()}}><FilterListIcon fontSize={"small"}/>&nbsp;Confirm Selection</Button>

                    <Tooltip title="Summary Settings">
                        <IconButton ref={this.anchorRef} onClick={() => setSettingsOpen(true)}><SettingsIcon></SettingsIcon></IconButton>
                    </Tooltip>
                    <SettingsPopover repList={this.state.rep_list} currentRep={this.state.current_rep} setCurrentRep={setCurrentRep} open={this.state.settingsOpen} setOpen={setSettingsOpen} anchorEl={this.anchorRef.current} refreshRepList={() => {this.loadRepList(true);}}></SettingsPopover>
                </Box>
                <LoadingIndicatorView area={loading_area}/>
                <ImageView setCheckedList={setCheckedList} selection={this.props.selection} columns={this.props.columns} aggregate={this.props.aggregate} current_rep={this.state.current_rep} handleMouseEnter={handleMouseEnter} handleMouseOut={handleMouseOut} />
                
            </div>;
        }

        return <div><ImageView selection={this.props.selection} columns={this.props.columns} aggregate={this.props.aggregate}/></div>;
    }
});


function loadImage(props, setComp, handleMouseEnter, handleMouseOut, cancellablePromise, setCheckedList){ 
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
                formData.append('contourLines', props.rdkitSettings.contourLines);
                formData.append('scale', props.rdkitSettings.scale);
                formData.append('sigma', props.rdkitSettings.sigma);
                formData.append('showMCS', props.rdkitSettings.showMCS);

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
                                    control={<Checkbox onChange={(event) => { onUpdateItem(i, event.target.checked); }} />}
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
            formData.append('contourLines', props.rdkitSettings.contourLines);
            formData.append('scale', props.rdkitSettings.scale);
            formData.append('sigma', props.rdkitSettings.sigma);
            formData.append('showMCS', props.rdkitSettings.showMCS);

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
    hoverState: state.hoverState,
    rdkitSettings: state.rdkitSettings
})
const mapDispatchToProps_Img = dispatch => ({
    setRDKitSettingsRefresh: input => dispatch(setRDKit_refresh(input)),
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
    setCheckedList?,
    setRDKitSettingsRefresh
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

const ImageView = connector_Img(function ({ hoverState, selection, columns, aggregate, handleMouseEnter, handleMouseOut, current_rep, setCheckedList, setRDKitSettingsRefresh, rdkitSettings }: Props_Img) {
    const [comp, setComp] = React.useState(<div></div>);
    
    const ref = React.useRef()
    const { cancellablePromise, cancelPromises } = useCancellablePromise();


    React.useEffect(() => {
        if(aggregate){
            setRDKitSettingsRefresh(()=>{
                updateImage({columns: columns, current_rep: current_rep, selection: selection, imgContainer: ref?.current, rdkitSettings: rdkitSettings}, cancellablePromise); 
            });
        }
    }, [columns, current_rep, selection, ref?.current, rdkitSettings.contourLines, rdkitSettings.scale, rdkitSettings.sigma, rdkitSettings.showMCS]);
    
    React.useEffect(() => {
        cancelPromises(); // cancel all unresolved promises
    }, [selection, current_rep])

    React.useEffect(() => {
        if(setCheckedList)
            setCheckedList([]);
        loadImage({columns: columns, aggregate: aggregate, current_rep: current_rep, selection: selection, rdkitSettings: rdkitSettings}, setComp, handleMouseEnter, handleMouseOut, cancellablePromise, setCheckedList); 
    }, [selection])

    React.useEffect(() => {
        if(aggregate)
            updateImage({columns: columns, current_rep: current_rep, selection: selection, imgContainer: ref?.current, rdkitSettings: rdkitSettings}, cancellablePromise); 
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



    return <div className={"chemContainer"}>
            <Grid ref={ref} className={"chem-grid"} container>{comp}</Grid>
        </div>;
});



const mapStateToProps_settings = (state: RootState) => ({
    rdkitSettings: state.rdkitSettings,
})
const mapDispatchToProps_settings = dispatch => ({
    setContourLines: input => dispatch(setRDKit_contourLines(input)),
    setScale: input => dispatch(setRDKit_scale(input)),
    setSigma: input => dispatch(setRDKit_sigma(input)),
    setShowMCS: input => dispatch(setRDKit_showMCS(input)),
})
const connector_settings = connect(mapStateToProps_settings, mapDispatchToProps_settings);

type PropsFromRedux_Settings = ConnectedProps<typeof connector_settings>


type SettingsPopoverProps = PropsFromRedux_Settings & {
    open: boolean
    setOpen: any
    anchorEl: any
    refreshRepList: any
    currentRep: string
    setCurrentRep: any
    repList: string[]
}

const SettingsPopover = connector_settings(function ({
    open,
    setOpen,
    anchorEl,
    refreshRepList,
    rdkitSettings,
    setContourLines,
    setScale,
    setSigma,
    setShowMCS
}: SettingsPopoverProps) {

    return <Popover
        disablePortal={true}
        id={"dialog to open"}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setOpen(() => false)}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
    >
        <div>
            <Paper style={{padding: 10, minWidth: 300}}>
                <FormGroup>
                    <Button 
                        size="small"
                        variant="outlined" 
                        aria-label={"Refresh Representation List"} onClick={() => refreshRepList(true)}>
                            <RefreshIcon/>Refresh Representation List
                    </Button>
                    <Typography variant="subtitle2" gutterBottom>RDKit Settings</Typography>

                    {/* https://github.com/rdkit/rdkit/blob/master/rdkit/Chem/Draw/SimilarityMaps.py */}
                    {/* how many contour lines should be drawn [0;inf] */}
                    <FormControl>
                        <InputLabel shrink htmlFor="contourLinesInput">Contour Lines <Tooltip title="Number of Contour Lines [0; &infin;] &isin; &#8469;"><InfoIcon fontSize="small"></InfoIcon></Tooltip></InputLabel>
                        <Input id="contourLinesInput" type="number" 
                            value={rdkitSettings.contourLines}
                            onChange={(event) => { 
                                let val = parseInt(event.target.value);
                                if(isNaN(val))
                                    setContourLines(event.target.value);
                                else
                                    setContourLines(Math.max(val, 0));
                                }} />
                    </FormControl>

                    {/* scale tells the programm about how to scale the weights [-1;inf]; default is -1 which means that it is inherted by the algorithm*/}
                    <FormControl>
                        <InputLabel shrink htmlFor="ScaleInput">Scale <Tooltip title="Weight Scale [-1; &infin;] &isin; &#8477;"><InfoIcon fontSize="small"></InfoIcon></Tooltip></InputLabel>
                        <Input id="ScaleInput" type="number" 
                            value={rdkitSettings.scale}
                            onChange={(event) => { 
                                let val = parseFloat(event.target.value);
                                if(isNaN(val))
                                    setScale(event.target.value);
                                else
                                    setScale(Math.max(val, -1)); 
                            }} />
                    </FormControl>

                    {/* sigma is for gaussian ]0;~0.2?]; default 0 means that the algorithm infers the value from the weights */}
                    {/* <FormControl>
                        <InputLabel shrink htmlFor="SigmaInput">Sigma <Tooltip title="Sigma for Gaussian ]0; &infin;] &isin; &#8477;. Makes sense to ~0.2. Default of 0 signals the algorithm to infer the value."><InfoIcon fontSize="small"></InfoIcon></Tooltip></InputLabel>
                        <Input id="SigmaInput" type="number" 
                            value={sigma}
                            onChange={(event) => { setSigma(Math.max(parseFloat(event.target.value), 0)); }} />
                    </FormControl> */}
                    <FormControl>
                        <InputLabel shrink htmlFor="SigmaInput">Sigma <Tooltip title="Sigma for Gaussian ]0; &infin;] &isin; &#8477;. Default of 0 signals the algorithm to infer the value."><InfoIcon fontSize="small"></InfoIcon></Tooltip></InputLabel>
                        <div className="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl">
                            <input aria-invalid="false" id="SigmaInput" type="number" className="MuiInputBase-input MuiInput-input"
                                step={0.01} // step size can only be defined in this input tag... not in the react Input tag
                                value={rdkitSettings.sigma}
                                onChange={(event) => { 
                                    let val = parseFloat(event.target.value);
                                    if(isNaN(val))
                                        setSigma(event.target.value);
                                    else
                                        setSigma(Math.max(val, 0)); 
                                }}
                            />
                        </div>
                    </FormControl>

                    <FormControlLabel
                        control={<Switch checked={rdkitSettings.showMCS} onChange={(_, value) => {setShowMCS(value);}} />}
                        label="Show MCS"
                    />

                    <Button 
                        style={{marginTop: 3, maxWidth: 150}}
                        size="small"
                        variant="outlined" 
                         onClick={() => {rdkitSettings.refresh()}}>
                            Apply Settings
                        </Button>
                </FormGroup>
            </Paper>
        </div>

    </Popover>
});


const RepresentationList = props => {

    const options = props.rep_list.map((rep) => {
        let split = rep.split('_');
        const inputVal = split.pop();
        let group = split.join('_');
        group = group.replace('atom.dprop.','');
        group = group.replace('atom.dprop','');
        return {
            group: group,
            value: rep,
            inputValue: inputVal
        };
    });

    const filterOptions = createFilterOptions({
        stringify: (option:any) => { return option.value; },
    });

    return <Autocomplete
            size={"small"}
            className={props.className}
            filterOptions={filterOptions}
            onChange={(event, newValue) => {
                if(newValue)
                    props.onChange(newValue.value);
            }}
            disablePortal={true}
            id="vectorRep"
            options={options.sort((a, b) => -b.group.localeCompare(a.group))}
            groupBy={(option:any) => option.group}
            getOptionLabel={(option:any) => option.inputValue}
            getOptionSelected={(option:any, value) => {return option.value == value.value;}}
            style={{ maxWidth: 300 }}
            // defaultValue={options[0]}
            
            renderInput={(params) => <TextField {...params} label="Choose Representation" variant="outlined" />}
        />
};
