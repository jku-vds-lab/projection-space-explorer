import { Button, Divider, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader } from "@material-ui/core"
import DeleteIcon from '@material-ui/icons/Delete';
import { BiRefresh } from "react-icons/bi";
import React = require("react")

import * as backend_utils from '../../../utils/backend-connect';
import { DatasetType } from "../../Utility/Data/DatasetType";
import { trackPromise } from "react-promise-tracker";
import { LoadingIndicatorView } from "../../Utility/Loaders/LoadingIndicator";


export var UploadedFiles = ({ onChange, refresh }) => {
    const [files, setFiles] = React.useState(null);
    React.useEffect(()=>{
        update_files(setFiles);
    }, [refresh]);

    var handleClick = (entry) => {
        onChange(entry)
    }
    
    var handleDelete = (file_name) => {
        console.log("delete")
        backend_utils.delete_file(file_name).then(x => {
            if(x && x['deleted'] == "true"){
                const new_files = [...files];
                const index = new_files.indexOf(file_name);
                if (index > -1) {
                    new_files.splice(index, 1);
                }
                setFiles(new_files);
            }
        });
    }
    // TODO: hide this when not for bayer...
    return (files && <div> 
        <Grid item style={{ overflowY: 'auto', flex: '1 1 auto', maxHeight: '400px' }}>

        <List subheader={<li />} style={{ backgroundColor: 'white' }}>
            <ListSubheader>Uploaded Files <Button onClick={() => update_files(setFiles)}><BiRefresh/></Button></ListSubheader>
            {
            files.map(file_name => (
                <ListItem key={file_name} button onClick={() => {
                    handleClick({
                        display: file_name,
                        path: file_name,
                        type: DatasetType.Chem,
                        uploaded: true // indicates that file is already uploaded
                    })
                }
                }>
                    <ListItemText primary={file_name}></ListItemText>
                    <ListItemSecondaryAction onClick={() => {handleDelete(file_name)}}>
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))
            }
        </List>
        <LoadingIndicatorView/>
    </Grid></div>) //<Divider/>
}


function update_files(setFiles){
    trackPromise(
        backend_utils.get_uploaded_files().then(data => {
        if(data && Object.keys(data).includes("file_list"))
            setFiles(data["file_list"])
    })
    );
}