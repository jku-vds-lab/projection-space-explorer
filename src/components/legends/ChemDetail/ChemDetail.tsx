import * as React from 'react'
import './chem.scss'
import * as backend_utils from '../../../utils/backend-connect'
import { MenuItem, Select } from '@material-ui/core';

/**
 * Chem Legend, implemented
 */


export class ChemLegend extends React.Component<{selection: any, columns: any, aggregate: boolean}, {comp: any, current_selection: any, update: boolean, rep_list: string[], current_rep: any}>{

    constructor(props: { selection, aggregate, columns }){
        super(props);
        this.state = {
            comp: <div>loading...</div>,
            current_selection: null,
            update: true,
            rep_list: [],
            current_rep: "Common Substructure"
        };

    }

    loadRepList(){
        if(this.state.rep_list.length <= 0){
            backend_utils.get_representation_list().then(x => {
                if(x["rep_list"].length > 0)
                    this.setState({rep_list: x["rep_list"]})
            })
        }
    }

    loadImage(){

        if(this.state.current_selection == this.props.selection && !this.state.update){

        }else{
            let smiles_col = "SMILES";

            for (const col_name in this.props.columns) {
                let col = this.props.columns[col_name];
                if(col.metaInformation.imgSmiles)
                    smiles_col = col_name;
            }
            if(smiles_col in this.props.columns){
                if (this.props.aggregate) {
                    const formData = new FormData();
                    formData.append('current_rep', this.state.current_rep);
                    this.props.selection.forEach(row => {
                        formData.append('smiles_list', row[smiles_col]);
                    });
                    backend_utils.get_structures_from_smiles_list(formData).then(x => {
                        // @ts-ignore
                        const img_lst = x["img_lst"].map((base64,i) => base64)//<img key={formData.getAll("smiles_list")[i]} className={"legend_multiple"} src={"data:image/jpeg;base64," + base64}/>)
                        console.log(img_lst);
                        this.setState({
                            comp: <div dangerouslySetInnerHTML={{ __html: img_lst.join("") }} />, 
                            current_selection:this.props.selection, 
                            update:false
                        })
                    });
                }else{
                    let row = this.props.selection[0]; 
                    backend_utils.get_structure_from_smiles(row[smiles_col]).then(x => this.setState({
                        comp: <img className={"legend_single"} src={"data:image/jpeg;base64," + x}/>, 
                        current_selection:this.props.selection, 
                        update:false}));
                }
            }else{
                this.setState({
                    comp: <div>no SMILES column found</div>, 
                    current_selection:this.props.selection, 
                    update:false})
            }
        }
    }

    render(){
        this.loadRepList();
        this.loadImage();

        if (this.props.aggregate) {
            return <div>
                <Select label="select representation"
                                id="vectorRep"
                                fullWidth={true}
                                displayEmpty
                                value={this.state.current_rep}
                                onChange={(event) => {
                                    this.setState({
                                        current_rep: event.target.value,
                                        update: true
                                    });

                                }}
                            >
                                <MenuItem value="Common Substructure">Common Substructure</MenuItem>
                                {this.state.rep_list.map(attribute => {
                                    return <MenuItem key={attribute} value={attribute}>{attribute}</MenuItem>
                                })}
                            </Select>
                {this.state.comp}
                </div>;
        }

        return <div>{this.state.comp}</div>;
    }
}
