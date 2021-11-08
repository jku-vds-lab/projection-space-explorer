import { Button, Checkbox, Container, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, InputLabel, MenuItem, Paper, Select, Switch, TextField } from '@mui/material';
import React = require('react')
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../Store/Store';
import clone = require('fast-clone')
import { DistanceMetric } from '../../../model/DistanceMetric';
import { NormalizationMethod } from '../../../model/NormalizationMethod';
import { EncodingMethod } from '../../../model/EncodingMethod';
import FeaturePicker from './FeaturePicker';

const mapState = (state: RootState) => ({
    projectionColumns: state.projectionColumns
})

const mapDispatch = dispatch => ({
})

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    domainSettings: any
    open: boolean
    onClose: any
    onStart: any
    projectionParams: any
}

const TSNESettings = ({ learningRate, setLearningRate, perplexity, setPerplexity }) => {


    return <FormGroup>
        <TextField
            id="textPerplexity"
            label="Perplexity"
            type="number"
            value={perplexity}
            onChange={(event) => {
                setPerplexity(event.target.value)
            }}
        />
        <TextField
            id="textLearningRate"
            label="Learning Rate"
            type="number"
            value={learningRate}
            onChange={(event) => {
                setLearningRate(event.target.value)
            }}
        />
    </FormGroup>
}

const UMAPSettings = ({ nNeighbors, setNNeighbors }) => {

    return <FormGroup>
        <TextField
            id="textNNeighbors"
            label="n Neighbors"
            type="number"
            value={nNeighbors}
            onChange={(event) => {
                setNNeighbors(event.target.value)
            }}
        />
    </FormGroup>
}

const GenericSettingsComp = ({ domainSettings, open, onClose, onStart, projectionParams, projectionColumns }: Props) => {
    const [perplexity, setPerplexity] = React.useState(projectionParams.perplexity)
    const [learningRate, setLearningRate] = React.useState(projectionParams.learningRate)
    const [nNeighbors, setNNeighbors] = React.useState(projectionParams.nNeighbors)
    const [iterations, setIterations] = React.useState(projectionParams.iterations)
    const [seeded, setSeeded] = React.useState(projectionParams.seeded)
    const [useSelection, setUseSelection] = React.useState(projectionParams.useSelection)

    const [distanceMetric, setDistanceMetric] = React.useState(projectionParams.distanceMetric)
     //TODO: maybe it would make sense to make a user input for normalization and encoding methods...
    const [normalizationMethod, setNormalizationMethod] = React.useState(projectionParams.normalizationMethod)
    const [encodingMethod, setEncodingMethod] = React.useState(projectionParams.encodingMethod)

    const changeDistanceMetric = (value) => { // when we change the distance metric, we need to adapt normalization Method and encoding of categorical features --> gower's distance usually normalizes between [0,1] and does not one-hot encode because it uses dedicated distance measures for categorical data
        
        switch(value){
            case DistanceMetric.GOWER:
                setNormalizationMethod(NormalizationMethod.NORMALIZE01);
                setEncodingMethod(EncodingMethod.NUMERIC);
                break;
            default:
                setNormalizationMethod(NormalizationMethod.STANDARDIZE);
                setEncodingMethod(EncodingMethod.ONEHOT);
                break;
        }
        setDistanceMetric(value);

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
                {domainSettings != 'forceatlas2' && <FeaturePicker selection={selection} setSelection={setSelection}></FeaturePicker>}


                <Grid container justifyContent="center" style={{ width: '100%' }}>
                    <Grid item>
                        <FormControl>
                            <FormLabel component="legend">Projection Parameters</FormLabel>

                            {domainSettings == 'umap' && <UMAPSettings nNeighbors={nNeighbors} setNNeighbors={setNNeighbors}></UMAPSettings>}
                            {domainSettings == 'tsne' && <TSNESettings learningRate={learningRate} setLearningRate={setLearningRate} perplexity={perplexity} setPerplexity={setPerplexity}></TSNESettings>}
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <FormControl>
                            <FormLabel component="legend">General Parameters</FormLabel>
                            <FormGroup>
                                <TextField
                                    id="textIterations"
                                    label="Iterations"
                                    type="number"
                                    value={iterations}
                                    onChange={(event) => {
                                        setIterations(event.target.value)
                                    }}
                                />
                                <FormControlLabel
                                    control={<Checkbox color="primary" checked={seeded} onChange={(_, checked) => setSeeded(checked)} name="jason" />}
                                    label="Seed Position"
                                />
                                <FormControlLabel
                                    control={<Checkbox color="primary" checked={useSelection} onChange={(_, checked) => setUseSelection(checked)} />}
                                    label="Project Selection Only"
                                />
                                {(domainSettings == 'tsne' || domainSettings == 'umap') && <FormControl>
                                    <InputLabel id="demo-controlled-open-select-label">Distance Metric</InputLabel>
                                    <Select
                                        labelId="demo-controlled-open-select-label"
                                        id="demo-controlled-open-select"
                                        value={distanceMetric}
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
                onStart({
                    iterations: iterations,
                    perplexity: perplexity,
                    learningRate: learningRate,
                    seeded: seeded,
                    nNeighbors: nNeighbors,
                    method: domainSettings,
                    useSelection: useSelection,
                    distanceMetric: distanceMetric,
                    normalizationMethod: normalizationMethod,
                    encodingMethod: encodingMethod
                }, selection)
            }}>Start</Button>
        </DialogActions>
    </Dialog >
}

export const GenericSettings = connector(GenericSettingsComp)