import { Grid, List, ListItem, ListItemText, ListSubheader } from "@material-ui/core"
import React = require("react")
import { TypeIcon } from "../../Icons/TypeIcon"
import { DatasetType } from "../../../model/DatasetType"
import { DatasetDatabase } from "../../Utility/Data/DatasetDatabase"

export var PredefinedDatasets = ({ onChange }) => {
    var database = new DatasetDatabase()
    var types = database.getTypes()

    var handleClick = (entry) => {
        onChange(entry)
        //if (entry.path.endsWith('json')) {
        //    new JSONLoader().resolvePath(entry, onChange)
        //} else {
        //    new CSVLoader().resolvePath(entry, onChange)
        //}
    }

    return <Grid item style={{ overflowY: 'auto', height: '100px', flex: '1 1 auto' }}>
        <List subheader={<li />} style={{ backgroundColor: 'white' }}>
            {
                types.map(type => {
                    return <li key={type} style={{ backgroundColor: 'inherit' }}>
                        <ul style={{ backgroundColor: 'inherit', paddingInlineStart: '0px' }}>
                            <ListSubheader>{Object.keys(DatasetType)[Object.values(DatasetType).indexOf(type)].replaceAll('_', ' ')}</ListSubheader>
                            {

                                database.data.filter(value => value.type == type).map(entry => {
                                    return <ListItem key={entry.path} button onClick={() => {
                                        handleClick(entry)
                                    }
                                    }>
                                        <TypeIcon type={entry.type} />
                                        <ListItemText primary={entry.display}></ListItemText>
                                    </ListItem>
                                })
                            }
                        </ul>
                    </li>
                })
            }

        </List>
    </Grid>
}