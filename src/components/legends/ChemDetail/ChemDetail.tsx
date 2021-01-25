import * as React from 'react';
import './chem.scss';
import * as backend_utils from '../../../utils/backend-connect';
import { MenuItem, Select } from '@material-ui/core';
import { trackPromise } from "react-promise-tracker";
import { LoadingIndicatorView } from "../../Utility/Loaders/LoadingIndicator";

/**
 * Chem Legend, implemented
 */


export class ChemLegend extends React.Component<{selection: any, columns: any, aggregate: boolean}, {rep_list: string[], current_rep: any}>{


    constructor(props: { selection, aggregate, columns }){
        super(props);
        this.state = {
            rep_list: [],
            current_rep: "Common Substructure"
        };

    }

    componentDidMount(){
        this.loadRepList();
    }

    loadRepList(){
        if(this.state.rep_list.length <= 0){
            backend_utils.get_representation_list().then(x => { // TODO: cache representation list
                if(x["rep_list"].length > 0)
                    this.setState({rep_list: x["rep_list"]})
            })
        }
    }
    
    render(){

        if (this.props.aggregate) {
            return <div>
                <RepresentationList 
                    value={this.state.current_rep} 
                    onChange={(event) => {
                        this.setState({
                            current_rep: event.target.value
                        });}}
                    rep_list={this.state.rep_list}
                />
                <LoadingIndicatorView/>
                <ImageView selection={this.props.selection} columns={this.props.columns} aggregate={this.props.aggregate} current_rep={this.state.current_rep} />
                </div>;
        }

        return <div><ImageView selection={this.props.selection} columns={this.props.columns} aggregate={this.props.aggregate} /></div>;
    }
}


function loadImage(props, setComp){
    let smiles_col = "SMILES";

    for (const col_name in props.columns) {
        let col = props.columns[col_name];
        if(col.metaInformation.imgSmiles)
            smiles_col = col_name;
    }
    if(smiles_col in props.columns){
        setComp(<div></div>);
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
                    const img_lst = x["img_lst"].map((base64,i) => <img key={i} className={"legend_multiple"} src={"data:image/jpeg;base64," + base64}/>) //key={props.selection[i][smiles_col]} --> gives error because sometimes smiles ocure twice
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
        setComp(<div>no SMILES column found</div>);
    }
}

const ImageView = props => {
    const [comp, setComp] = React.useState(<div></div>);

    React.useEffect(() => {
        loadImage(props, setComp);
    }, [props.selection, props.current_rep]);
    

    return comp;
}

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
}
