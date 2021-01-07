import * as React from 'react'
import './chem.scss'
import * as backend_utils from '../../../utils/backend-connect'

/**
 * Chem Legend, implemented
 */


export class ChemLegend extends React.Component<{selection: any, columns: any, aggregate: boolean}, {comp: any, current_selection: any}>{

    constructor(props: { selection, aggregate, columns }){
        super(props);
        this.state = {
            comp: <div>no SMILES column found</div>,
            current_selection: null
        };

    }

    loadImage(){
        if(this.state.current_selection == this.props.selection){

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
                    this.props.selection.forEach(row => {
                        formData.append('smiles_list', row[smiles_col]);
                    });
                    backend_utils.get_structures_from_smiles_list(formData).then(x => {
                        // @ts-ignore
                        const img_lst = x["img_lst"].map((base64,i) => <img key={formData.getAll("smiles_list")[i]} className={"legend_multiple"} src={"data:image/gif;base64," + base64}/>)
                        this.setState({
                            comp: img_lst, 
                            current_selection:this.props.selection
                        })
                    });
                }else{
                    let row = this.props.selection[0];
                    backend_utils.get_structure_from_smiles(row[smiles_col]).then(x => this.setState({comp: <img className={"legend_single"} src={"data:image/gif;base64," + x}/>, current_selection:this.props.selection}));
                }
            }else{
                this.setState({comp: <div>no SMILES column found</div>, current_selection:this.props.selection})
            }
        }
    }

    render(){
        this.loadImage();
        return this.state.comp;
    }
}
