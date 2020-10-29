import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DragAndDrop from './draganddrop';
import { LinearProgress, Typography } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ShareIcon from '@material-ui/icons/Share';
import { DatasetDatabase, Vect, DatasetType } from './datasetselector'
import Button from '@material-ui/core/Button';
import WidgetsIcon from '@material-ui/icons/Widgets';
import * as React from 'react'
import { CSVLoader } from '../../model/Loaders/CSVLoader';
import { JSONLoader } from '../../model/Loaders/JSONLoader';







var TypeIcon = ({ type }) => {
    switch (type) {
        case DatasetType.Neural:
            return <ListItemIcon><ShareIcon>
            </ShareIcon></ListItemIcon>
        case DatasetType.Story:
            return <ListItemIcon><MenuBookIcon>
            </MenuBookIcon></ListItemIcon>
        case DatasetType.Chess:
            return <ListItemIcon><SvgIcon viewBox="0 0 45 45">
                <g style={{ opacity: 1, fill: 'none', fillRule: 'evenodd', fillOpacity: 1, stroke: '#000000', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }}>
                    <g style={{ fill: '#000000', stroke: '#000000', strokeLinecap: 'butt' }}>
                        <path
                            d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z" />
                        <path
                            d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" />
                        <path
                            d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z" />
                    </g>
                    <path
                        d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18"
                        style={{ fill: 'none', stroke: '#ffffff', strokeLinejoin: 'miter' }} />
                </g>
            </SvgIcon></ListItemIcon>
        case DatasetType.Rubik:
            return <ListItemIcon>
                <WidgetsIcon />
            </ListItemIcon>
        default:
            return <div></div>
    }
}


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



export var DatasetDrop = ({ onChange }) => {
    return <Grid container item alignItems="stretch" justify="center" direction="column" style={{ padding: '16px' }}>
        <DragAndDrop accept="image/*" handleDrop={(files) => {
            if (files == null || files.length <= 0) {
                return;
            }

            var file = files[0]
            var fileName = file.name as string

            var reader = new FileReader()
            reader.onload = (event) => {
                var content = event.target.result

                if (fileName.endsWith('json')) {
                    new JSONLoader().resolveContent(content, onChange)
                } else {
                    new CSVLoader().resolveContent(content, onChange)
                }
            }

            reader.readAsText(file)


        }}>
            <div style={{ height: 200 }}></div>
        </DragAndDrop>
    </Grid>
}


export var DatasetList = ({ onChange }) => {
    var database = new DatasetDatabase()

    const [loading, setLoad] = React.useState(false)

    var handleClick = (entry) => {
        if (entry.path.endsWith('json')) {
            new JSONLoader().resolvePath(entry, onChange)
        } else {
            new CSVLoader().resolvePath(entry, onChange)
        }
    }

    var database = new DatasetDatabase()
    var types = database.getTypes()

    {

        return loading ?
            <Grid container direction="column" justify="center" alignItems="center" style={{ width: 800, height: 500 }}>
                <LinearProgress style={{ width: 500 }} />
            </Grid>
            :

            <Grid container direction="row" alignItems="center" justify="center" style={{ width: 800, padding: '32px' }}>
                <Grid item style={{ width: '50%' }} container direction="column">
                    <Typography variant={'h6'} align="center" style={{ margin: '12px 0px' }}>Preloaded Datasets</Typography>

                    <Grid item style={{ overflow: 'auto', height: 400, border: '1px solid gray' }}>
                        <List subheader={<li />} style={{ backgroundColor: 'white' }}>
                            {
                                types.map(type => (
                                    <li key={type} style={{ backgroundColor: 'inherit' }}>
                                        <ul style={{ backgroundColor: 'inherit', paddingInlineStart: '0px' }}>
                                            <ListSubheader>{Object.keys(DatasetType)[Object.values(DatasetType).indexOf(type)]}</ListSubheader>
                                            {

                                                database.data.filter(value => value.type == type).map(entry => {
                                                    return <ListItem key={entry.path} button onClick={() => {
                                                        setLoad(true)
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

                </Grid>

                <Grid style={{ width: '50%' }} item>
                    <Typography variant={'h6'} align="center" style={{ margin: '12px 0px' }}>Custom Datasets</Typography>
                    <Grid container item alignItems="stretch" justify="center" direction="column" style={{ height: 400, padding: '30px' }}>
                        <DragAndDrop accept="image/*" handleDrop={(files) => {
                            if (files == null || files.length <= 0) {
                                return;
                            }

                            var file = files[0]
                            var fileName = file.name as string

                            var reader = new FileReader()
                            reader.onload = (event) => {
                                var content = event.target.result

                                if (fileName.endsWith('json')) {
                                    new JSONLoader().resolveContent(content, onChange)
                                } else {
                                    new CSVLoader().resolveContent(content, onChange)
                                }
                            }

                            reader.readAsText(file)


                        }}>
                            <div style={{ height: 200 }}></div>
                        </DragAndDrop>
                    </Grid>

                </Grid>
            </Grid>
    }

}



export var ChooseFileDialog = ({ onChange }) => {
    const [open, setOpen] = React.useState(false)

    return <Grid
        container
        justify="center"
        alignItems="stretch"
        direction="column"
        style={{ padding: '8px 16px' }}>
        <Button variant="outlined" onClick={(event) => {
            setOpen(true)
        }}>Load Dataset</Button>
        <Dialog maxWidth='md' open={open} onClose={() => { setOpen(false) }}>
            <DatasetList onChange={(dataset, json) => {
                setOpen(false)
                onChange(dataset, json)
            }}></DatasetList>
        </Dialog>
    </Grid>
}