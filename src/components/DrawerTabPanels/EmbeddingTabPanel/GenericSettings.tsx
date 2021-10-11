import { Button, Checkbox, Container, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, InputLabel, MenuItem, Paper, Select, Switch, TextField } from '@mui/material';
import React = require('react')
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../Store/Store';
import FeaturePicker from './FeaturePicker';
import clone = require('fast-clone')

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
            size='small'
            id="textPerplexity"
            label="Perplexity"
            type="number"
            value={perplexity}
            onChange={(event) => {
                setPerplexity(event.target.value)
            }}
        />
        <TextField
            size='small'
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
            size='small'
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


                <Grid container justifyContent="center" style={{ width: '100%' }} spacing={3}>
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
                                    size='small'
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
                                    <FormHelperText>Distance Metric</FormHelperText>
                                    <Select
                                        displayEmpty
                                        size='small'
                                        id="demo-controlled-open-select"
                                        value={distanceMetric}
                                        onChange={(event) => { setDistanceMetric(event.target.value) }}
                                    >
                                        <MenuItem value={'euclidean'}>Euclidean</MenuItem>
                                        <MenuItem value={'jaccard'}>Jaccard</MenuItem>
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
                    distanceMetric: distanceMetric
                }, selection)
            }}>Start</Button>
        </DialogActions>
    </Dialog >
}

export const GenericSettings = connector(GenericSettingsComp)