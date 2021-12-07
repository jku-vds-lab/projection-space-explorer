import { Button, Checkbox, Container, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, InputLabel, MenuItem, Paper, Select, Switch, TextField } from '@mui/material';
import React = require('react')
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../Store/Store';
import clone = require('fast-clone')
import { DistanceMetric } from '../../../model/DistanceMetric';
import { NormalizationMethod } from '../../../model/NormalizationMethod';
import { EncodingMethod } from '../../../model/EncodingMethod';
import FeaturePicker from './FeaturePicker';
import { setProjectionParamsAction } from '../..';

const mapState = (state: RootState) => ({
    projectionColumns: state.projectionColumns,
    projectionParams: state.projectionParams,
})

const mapDispatch = dispatch => ({
    setProjectionParams: value => dispatch(setProjectionParamsAction(value)),
})

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    domainSettings: any
    open: boolean
    onClose: any
    onStart: any
    // projectionParams: any
}

const CustomSettings = ({learningRate, setLearningRate, perplexity, setPerplexity, nNeighbors, setNNeighbors, inputDict}) => {
    return <FormGroup>
        {inputDict["perplexity"] && <TextField
            id="textPerplexity"
            label="Perplexity"
            type="number"
            value={perplexity}
            onChange={(event) => {
                setPerplexity(event.target.value)
            }}
        />}
        {inputDict["learningRate"] && <TextField
            id="textLearningRate"
            label="Learning Rate"
            type="number"
            value={learningRate}
            onChange={(event) => {
                setLearningRate(event.target.value)
            }}
        />}
        {inputDict["nneighbors"] &&
            <TextField
                id="textNNeighbors"
                label="n Neighbors"
                type="number"
                value={nNeighbors}
                onChange={(event) => {
                    setNNeighbors(event.target.value)
                }}
            />}
    </FormGroup>
}

const TSNESettings = ({ tempProjectionParams, setTempProjectionParams }) => {


    return <FormGroup>
        <TextField
            id="textPerplexity"
            label="Perplexity"
            type="number"
            value={tempProjectionParams.perplexity}
            onChange={(event) => {
                // setPerplexity(event.target.value)
                setTempProjectionParams({...tempProjectionParams, perplexity: event.target.value});
            }}
        />
        <TextField
            id="textLearningRate"
            label="Learning Rate"
            type="number"
            value={tempProjectionParams.learningRate}
            onChange={(event) => {
                // setLearningRate(event.target.value)
                setTempProjectionParams({...tempProjectionParams, learningRate: event.target.value});
            }}
        />
    </FormGroup>
}

const UMAPSettings = ({ tempProjectionParams, setTempProjectionParams }) => {

    return <FormGroup>
        <TextField
            id="textNNeighbors"
            label="n Neighbors"
            type="number"
            value={tempProjectionParams.nNeighbors}
            onChange={(event) => {
                // setNNeighbors(event.target.value)
                setTempProjectionParams({...tempProjectionParams, nNeighbors: event.target.value});
            }}
        />
    </FormGroup>
}

const GenericSettingsComp = ({ domainSettings, open, onClose, onStart, projectionParams, setProjectionParams, projectionColumns }: Props) => {

    const [tempProjectionParams, setTempProjectionParams] = React.useState({...projectionParams})
    // const [perplexity, setPerplexity] = React.useState(projectionParams.perplexity)
    // const [learningRate, setLearningRate] = React.useState(projectionParams.learningRate)
    // const [nNeighbors, setNNeighbors] = React.useState(projectionParams.nNeighbors)
    // const [iterations, setIterations] = React.useState(projectionParams.iterations)
    // const [seeded, setSeeded] = React.useState(projectionParams.seeded)
    // const [useSelection, setUseSelection] = React.useState(projectionParams.useSelection)

    // const [distanceMetric, setDistanceMetric] = React.useState(projectionParams.distanceMetric)
    //  //TODO: maybe it would make sense to make a user input for normalization and encoding methods...
    // const [normalizationMethod, setNormalizationMethod] = React.useState(projectionParams.normalizationMethod)
    // const [encodingMethod, setEncodingMethod] = React.useState(projectionParams.encodingMethod)

    const changeDistanceMetric = (value) => { // when we change the distance metric, we need to adapt normalization Method and encoding of categorical features --> gower's distance usually normalizes between [0,1] and does not one-hot encode because it uses dedicated distance measures for categorical data
        
        switch(value){
            case DistanceMetric.GOWER:
                setTempProjectionParams({...tempProjectionParams, normalizationMethod: NormalizationMethod.NORMALIZE01});
                // setNormalizationMethod(NormalizationMethod.NORMALIZE01);
                setTempProjectionParams({...tempProjectionParams, encodingMethod: EncodingMethod.NUMERIC});
                // setEncodingMethod(EncodingMethod.NUMERIC);
                break;
            default:
                setTempProjectionParams({...tempProjectionParams, normalizationMethod: NormalizationMethod.STANDARDIZE});
                // setNormalizationMethod(NormalizationMethod.STANDARDIZE);
                setTempProjectionParams({...tempProjectionParams, encodingMethod: EncodingMethod.ONEHOT});
                // setEncodingMethod(EncodingMethod.ONEHOT);
                break;
        }
        // setDistanceMetric(value);
        setTempProjectionParams({...tempProjectionParams, distanceMetric: value});

    }

    const cloneColumns = (projectionColumns) => {
        return projectionColumns.map(val => {
            return clone(val)
        })
    }

    const [selection, setSelection] = React.useState(cloneColumns(projectionColumns))

    React.useEffect(() => {
        if (open) {
            setSelection(cloneColumns(projectionColumns))
        }
    }, [projectionColumns, open])


    return <Dialog maxWidth='lg'
        open={open}
        onClose={onClose}>

        <DialogContent>
            <Container>
                {domainSettings.id != 'forceatlas2' && <FeaturePicker selection={selection} setSelection={setSelection}></FeaturePicker>}


                <Grid container justifyContent="center" style={{ width: '100%' }}>
                    <Grid item>
                        <FormControl sx={{
                                '& .MuiTextField-root': { m: 1 },
                                '& .MuiFormControlLabel-root': { m: 1 },
                                '& .MuiFormControl-root': { m: 1 }
                            }}>
                            <FormLabel component="legend">Projection Parameters</FormLabel>
                            {/* TODO: add custom settings */}
                            {domainSettings.id == 'umap' && <UMAPSettings tempProjectionParams={tempProjectionParams} setTempProjectionParams={setTempProjectionParams}></UMAPSettings>}
                            {domainSettings.id == 'tsne' && <TSNESettings tempProjectionParams={tempProjectionParams} setTempProjectionParams={setTempProjectionParams}></TSNESettings>}
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <FormControl>
                            <FormLabel component="legend">General Parameters</FormLabel>
                            <FormGroup sx={{
                                '& .MuiTextField-root': { m: 1 },
                                '& .MuiFormControlLabel-root': { m: 1 },
                                '& .MuiFormControl-root': { m: 1 }
                            }}>
                                <TextField
                                    id="textIterations"
                                    label="Iterations"
                                    type="number"
                                    value={tempProjectionParams.iterations}
                                    onChange={(event) => {
                                        // setIterations(parseInt(event.target.value))
                                        setTempProjectionParams({...tempProjectionParams, iterations: parseInt(event.target.value)});
                                    }}
                                />
                                <FormControlLabel
                                    control={<Checkbox color="primary" checked={tempProjectionParams.seeded} onChange={
                                        (_, checked) => 
                                        // setSeeded(checked)
                                        setTempProjectionParams({...tempProjectionParams, seeded: checked})
                                    } name="jason" />}
                                    label="Seed Position"
                                />
                                <FormControlLabel
                                    control={<Checkbox color="primary" checked={tempProjectionParams.useSelection} onChange={
                                        (_, checked) => 
                                        // setUseSelection(checked)
                                        setTempProjectionParams({...tempProjectionParams, useSelection: checked})
                                    } />}
                                    label="Project Selection Only"
                                />
                                {(domainSettings.id != 'forceatlas2') && <FormControl>
                                    <InputLabel id="demo-controlled-open-select-label">Distance Metric</InputLabel>
                                    <Select
                                        labelId="demo-controlled-open-select-label"
                                        id="demo-controlled-open-select"
                                        label='Distance Metric'
                                        value={tempProjectionParams.distanceMetric}
                                        onChange={(event) => { changeDistanceMetric(event.target.value) }}
                                    >
                                        <MenuItem value={DistanceMetric.EUCLIDEAN}>Euclidean</MenuItem>
                                        <MenuItem value={DistanceMetric.JACCARD}>Jaccard</MenuItem>
                                        <MenuItem value={DistanceMetric.GOWER}>Gower</MenuItem>
                                    </Select>
                                </FormControl>}
                            </FormGroup>
                        </FormControl>
                    </Grid>
                </Grid>
            </Container>
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={onClose}>Cancel</Button>
            <Button color="primary" onClick={() => {
                setProjectionParams(tempProjectionParams)
                onStart(tempProjectionParams, selection)
            }}>Start</Button>
        </DialogActions>
    </Dialog >
}

export const GenericSettings = connector(GenericSettingsComp)