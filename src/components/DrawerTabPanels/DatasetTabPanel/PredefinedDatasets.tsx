import { Grid, List, ListItem, ListItemText, ListSubheader } from "@material-ui/core"
import React = require("react")
import { TypeIcon } from "../../Icons/TypeIcon"
import { DatasetDatabase, DatasetType } from "../../util/datasetselector"
import { CSVLoader } from "../../util/Loaders/CSVLoader"
import { JSONLoader } from "../../util/Loaders/JSONLoader"

export var PredefinedDatasets = ({ onChange }) => {
    var database = new DatasetDatabase()
    var types = database.getTypes()

    var handleClick = (entry) => {
        if (entry.path.endsWith('json')) {
            new JSONLoader().resolvePath(entry, onChange)
        } else {
            new CSVLoader().resolvePath(entry, onChange)
        }
    }

    return <Grid item style={{ overflowY: 'auto', height: '100px', flex: '1 1 auto' }}>
        <List subheader={<li />} style={{ backgroundColor: 'white' }}>
            {
                types.map(type => (
                    <li key={type} style={{ backgroundColor: 'inherit' }}>
                        <ul style={{ backgroundColor: 'inherit', paddingInlineStart: '0px' }}>
                            <ListSubheader>{Object.keys(DatasetType)[Object.values(DatasetType).indexOf(type)]}</ListSubheader>
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
                ))
            }

        </List>
    </Grid>
}