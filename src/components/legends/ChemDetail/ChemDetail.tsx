import * as React from 'react';
import './chem.scss';
import * as backend_utils from '../../../utils/backend-connect';
import { Grid, MenuItem, Select } from '@material-ui/core';
import { trackPromise } from "react-promise-tracker";
import { LoadingIndicatorView } from "../../Utility/Loaders/LoadingIndicator";
import { RootState } from '../../Store/Store';
import { connect, ConnectedProps } from 'react-redux';

/**
 * Chem Legend, implemented
 */



const UPDATER = "chemdetail";
export class ChemLegend extends React.Component<{selection: any, columns: any, aggregate: boolean, hoverUpdate}, {rep_list: string[], current_rep: any}>{


    constructor(props: { selection, aggregate, columns, hoverUpdate }){
        super(props);
        this.state = {
            rep_list: [],
            current_rep: "Common Substructure",
        };

    }

    componentDidMount(){
        this.loadRepList();
    }

    loadRepList(){
        if(this.state.rep_list.length <= 0){
            backend_utils.get_representation_list().then(x => {
                if(x["rep_list"].length > 0)
                    this.setState({...this.state, rep_list: x["rep_list"]});
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
                    onChange={(event) => {
                        this.setState({...this.state, current_rep: event.target.value});
                    }}
                    rep_list={this.state.rep_list}
                />
                <LoadingIndicatorView/>
                <ImageView selection={this.props.selection} columns={this.props.columns} aggregate={this.props.aggregate} current_rep={this.state.current_rep} handleMouseEnter={handleMouseEnter} handleMouseOut={handleMouseOut} />
                </div>;
        }

        return <div><ImageView selection={this.props.selection} columns={this.props.columns} aggregate={this.props.aggregate}/></div>;
    }
}


function loadImage(props, setComp, handleMouseEnter, handleMouseOut){
    let smiles_col = "SMILES";

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
                trackPromise(
                    backend_utils.get_structures_from_smiles_list(formData).then(x => {
                        // @ts-ignore
                        //const img_lst = x["img_lst"].map((svg,i) => svg)
                        const img_lst = x["img_lst"].map((base64,i) => {
                            return <Grid className={"legend_multiple"} key={i} item><img src={"data:image/jpeg;base64," + base64} onMouseEnter={() => {handleMouseEnter(i);}} onMouseOver={() => {handleMouseEnter(i);}} onMouseLeave={() => {handleMouseOut();}}/></Grid>
                        }) //key={props.selection[i][smiles_col]} --> gives error because sometimes smiles ocure twice
                        setComp(img_lst);//<div dangerouslySetInnerHTML={{ __html: img_lst.join("") }} />
                    })
                );
            }else{
                let row = props.selection[0]; 
                backend_utils.get_structure_from_smiles(row[smiles_col]).then(x => 
                    setComp(<img className={"legend_single"} src={"data:image/jpeg;base64," + x}/>)
                );
            }
        }else{
            setComp(<div>No Selection</div>);
        }
    }else{
        setComp(<div>No SMILES column found</div>);
    }
}



const mapStateToProps = (state: RootState) => ({
    hoverState: state.hoverState
})
const connector = connect(mapStateToProps);


/**
 * Type that holds the props we declared above in mapStateToProps and mapDispatchToProps
 */
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    selection,
    columns,
    aggregate,
    handleMouseEnter?,
    handleMouseOut?,
    current_rep?
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


const ImageView = connector(function ({ hoverState, selection, columns, aggregate, handleMouseEnter, handleMouseOut, current_rep }: Props) {
    const [comp, setComp] = React.useState(<div></div>);
    const ref = React.useRef()

    React.useEffect(() => {
        loadImage({columns: columns, aggregate: aggregate, current_rep: current_rep, selection: selection}, setComp, handleMouseEnter, handleMouseOut);
    }, [selection, current_rep]);
    
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

    return <Grid ref={ref} className={"chem-grid"} container>{comp}</Grid>;
});

const RepresentationList = props => {

    return <Select label="select representation"
        id="vectorRep"
        fullWidth={true}
        displayEmpty
        value={props.value}
        onChange={props.onChange}
    >
        <MenuItem value="Common Substructure">Common Substructure</MenuItem>
        {props.rep_list.map(attribute => {
            return <MenuItem key={attribute} value={attribute}>{attribute}</MenuItem>
        })}
    </Select>
};
