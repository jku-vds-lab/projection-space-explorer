import {
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import clone from 'fast-clone';
import { InfoOutlined } from '@mui/icons-material';
import type { RootState } from '../../Store/Store';
import { DistanceMetric } from '../../../model/DistanceMetric';
import { NormalizationMethod } from '../../../model/NormalizationMethod';
import { EncodingMethod } from '../../../model/EncodingMethod';
import { FeaturePicker } from './FeaturePicker';
import { setProjectionParamsAction } from '../../Ducks/ProjectionParamsDuck';
import { ProjectionMethod } from '../../../model';
import type { ProjectionColumn } from '../../Ducks';
import { EmbeddingMethod, FeatureConfig } from '../../../BaseConfig';

const mapState = (state: RootState) => ({
  projectionColumns: state.projectionColumns,
  projectionParams: state.projectionParams,
  columns: state.dataset?.columns,
});

const mapDispatch = (dispatch) => ({
  setProjectionParams: (value) => dispatch(setProjectionParamsAction(value)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  domainSettings: EmbeddingMethod;
  featureConfig: FeatureConfig;
  open: boolean;
  onClose: any;
  onStart: any;
};

function CustomSettings({ tempProjectionParams, setTempProjectionParams, inputDict }) {
  return (
    <FormGroup>
      {inputDict.perplexity && (
        <TextField
          id="textPerplexity"
          label="Perplexity"
          type="number"
          value={tempProjectionParams.perplexity}
          onChange={(event) => {
            setTempProjectionParams({ ...tempProjectionParams, perplexity: event.target.value });
          }}
        />
      )}
      {inputDict.learningRate && (
        <TextField
          id="textLearningRate"
          label="Learning rate"
          type="number"
          value={tempProjectionParams.learningRate}
          onChange={(event) => {
            setTempProjectionParams({ ...tempProjectionParams, learningRate: event.target.value });
          }}
        />
      )}
      {inputDict.nneighbors && (
        <TextField
          id="textNNeighbors"
          data-cy="projection-neighbors-number-input"
          label="Neighbors"
          type="number"
          value={tempProjectionParams.nNeighbors}
          onChange={(event) => {
            setTempProjectionParams({ ...tempProjectionParams, nNeighbors: event.target.value });
          }}
        />
      )}
    </FormGroup>
  );
}

// const TSNESettings = ({ tempProjectionParams, setTempProjectionParams }) => {

//     return <FormGroup>
//         <TextField
//             id="textPerplexity"
//             label="Perplexity"
//             type="number"
//             value={tempProjectionParams.perplexity}
//             onChange={(event) => {
//                 setTempProjectionParams({...tempProjectionParams, perplexity: event.target.value});
//             }}
//         />
//         <TextField
//             id="textLearningRate"
//             label="Learning Rate"
//             type="number"
//             value={tempProjectionParams.learningRate}
//             onChange={(event) => {
//                 setTempProjectionParams({...tempProjectionParams, learningRate: event.target.value});
//             }}
//         />
//     </FormGroup>
// }

// const UMAPSettings = ({ tempProjectionParams, setTempProjectionParams }) => {

//     return <FormGroup>
//         <TextField
//             id="textNNeighbors"
//             label="n Neighbors"
//             type="number"
//             value={tempProjectionParams.nNeighbors}
//             onChange={(event) => {
//                 setTempProjectionParams({...tempProjectionParams, nNeighbors: event.target.value});
//             }}
//         />
//     </FormGroup>
// }

function GenericSettingsComp({
  domainSettings,
  open,
  onClose,
  onStart,
  projectionParams,
  setProjectionParams,
  projectionColumns,
  columns,
  featureConfig,
}: Props) {
  const [tempProjectionParams, setTempProjectionParams] = React.useState({ ...projectionParams });

  const changeDistanceMetric = (value) => {
    // when we change the distance metric, we need to adapt normalization Method and encoding of categorical features --> gower's distance usually normalizes between [0,1] and does not one-hot encode because it uses dedicated distance measures for categorical data
    // TODO: maybe it would make sense to make a user input for normalization and encoding methods...
    switch (value) {
      case DistanceMetric.GOWER:
        setTempProjectionParams({
          ...tempProjectionParams,
          normalizationMethod: NormalizationMethod.NORMALIZE01,
          encodingMethod: EncodingMethod.NUMERIC,
          distanceMetric: value,
        });
        break;
      case DistanceMetric.JACCARD:
        setTempProjectionParams({
          ...tempProjectionParams,
          normalizationMethod: NormalizationMethod.NORMALIZE01,
          encodingMethod: EncodingMethod.NONE,
          distanceMetric: value,
        });
        break;
      default:
        setTempProjectionParams({
          ...tempProjectionParams,
          normalizationMethod: NormalizationMethod.STANDARDIZE,
          encodingMethod: EncodingMethod.ONEHOT,
          distanceMetric: value,
        });
        break;
    }
  };

  const cloneColumns = (projectionColumns) => {
    return projectionColumns.map((val) => {
      return clone(val);
    });
  };

  const [selection, setSelection] = React.useState(cloneColumns(projectionColumns) as ProjectionColumn[]);
  const [selectedRows, setSelectedRows] = React.useState<ReadonlySet<string>>(() => new Set(selection.filter((row) => row.checked).map((row) => row.name)));

  const intermediateSetSelection = (selectedFeatures) => {
    const filteredFeatures = Array.from(selectedFeatures);
    const nonNumericSelectedColumns = filteredFeatures.filter((col: string) => !columns[col].isNumeric);

    if (nonNumericSelectedColumns.length === filteredFeatures.length) {
      // set default metric to Jaccard, if only non-numeric datatypes are selected
      changeDistanceMetric(DistanceMetric.JACCARD);
    } else if (nonNumericSelectedColumns.length > 0) {
      // set default metric to gower, if we have mixed datatypes
      changeDistanceMetric(DistanceMetric.GOWER);
    } else {
      // set default metric to euclidean, if we only have numeric datatypes
      changeDistanceMetric(DistanceMetric.EUCLIDEAN);
    }
    setSelectedRows(selectedFeatures);
  };

  const ref = React.useRef<any>();
  ref.current = intermediateSetSelection;

  React.useEffect(() => {
    if (open) {
      setSelection(cloneColumns(projectionColumns));
      ref.current(new Set(projectionColumns.filter((row) => row.checked).map((row) => row.name)));
    }
  }, [projectionColumns, open]);

  return (
    <Dialog maxWidth={domainSettings?.settings?.hideSettings !== true ? 'xl' : 'md'} open={open} onClose={onClose} fullWidth>
      <DialogTitle>Project dataset with {domainSettings.name}</DialogTitle>

      {domainSettings?.settings?.hideSettings ? (
        <DialogContent>
          <DialogContentText>{domainSettings?.description}</DialogContentText>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogContentText paddingBottom={2}>{domainSettings?.description}</DialogContentText>
          <Container>
            {domainSettings.id !== ProjectionMethod.FORCEATLAS2 && (
              <FeaturePicker
                selection={selection}
                setSelection={setSelection}
                setSelectedRows={intermediateSetSelection}
                selectedRows={selectedRows}
                featureConfig={featureConfig}
              />
            )}

            <Grid container justifyContent="center" style={{ width: '100%' }}>
              <Grid item>
                <FormControl
                  sx={{
                    '& .MuiTextField-root': { m: 1 },
                    '& .MuiFormControlLabel-root': { m: 1 },
                    '& .MuiFormControl-root': { m: 1 },
                  }}
                >
                  <FormLabel component="legend">Projection parameters</FormLabel>
                  {/* TODO: add also make parameters customizable; currently only a fixed set of parameters can set to be shown or not */}
                  <CustomSettings
                    tempProjectionParams={tempProjectionParams}
                    setTempProjectionParams={setTempProjectionParams}
                    inputDict={domainSettings.settings}
                  />
                  {/* {domainSettings.id == 'umap' && <UMAPSettings tempProjectionParams={tempProjectionParams} setTempProjectionParams={setTempProjectionParams}></UMAPSettings>} */}
                  {/* {domainSettings.id == 'tsne' && <TSNESettings tempProjectionParams={tempProjectionParams} setTempProjectionParams={setTempProjectionParams}></TSNESettings>} */}
                </FormControl>
              </Grid>

              <Grid item>
                <FormControl>
                  <FormLabel component="legend">General parameters</FormLabel>
                  <FormGroup
                    sx={{
                      '& .MuiTextField-root': { m: 1 },
                      '& .MuiFormControlLabel-root': { m: 1 },
                      '& .MuiFormControl-root': { m: 1 },
                    }}
                  >
                    <TextField
                      id="textIterations"
                      data-cy="projection-iterations-number-input"
                      label="Iterations"
                      type="number"
                      value={tempProjectionParams.iterations}
                      onChange={(event) => {
                        setTempProjectionParams({ ...tempProjectionParams, iterations: parseInt(event.target.value, 10) });
                      }}
                    />
                    {domainSettings.id !== ProjectionMethod.FORCEATLAS2 && (
                      <FormControl>
                        <InputLabel id="demo-controlled-open-select-label">Distance metric</InputLabel>
                        <Select
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          label="Distance metric"
                          value={tempProjectionParams.distanceMetric}
                          onChange={(event) => {
                            changeDistanceMetric(event.target.value);
                          }}
                        >
                          <MenuItem value={DistanceMetric.EUCLIDEAN}>Euclidean</MenuItem>
                          <MenuItem value={DistanceMetric.JACCARD}>Jaccard</MenuItem>
                          <MenuItem value={DistanceMetric.GOWER}>Gower</MenuItem>
                        </Select>
                      </FormControl>
                    )}

                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={tempProjectionParams.seeded}
                          onChange={(_, checked) => setTempProjectionParams({ ...tempProjectionParams, seeded: checked })}
                          name="jason"
                        />
                      }
                      label={
                        <Typography>
                          Seed position{' '}
                          <Tooltip
                            title={
                              <Typography variant="subtitle2">
                                If activated, the projection methods uses the current projection positions as a starting point.
                              </Typography>
                            }
                          >
                            <InfoOutlined fontSize="inherit" style={{ color: 'grey' }} />
                          </Tooltip>
                        </Typography>
                      }
                    />
                    {domainSettings.settings.projectSelectionOnly && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            checked={tempProjectionParams.useSelection}
                            onChange={(_, checked) => setTempProjectionParams({ ...tempProjectionParams, useSelection: checked })}
                          />
                        }
                        label="Project selection only"
                      />
                    )}
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
      )}
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => {
            selection.forEach((row) => {
              row.checked = selectedRows.has(row.name);
            });

            tempProjectionParams.method = domainSettings.id;
            setProjectionParams(tempProjectionParams);
            onStart(tempProjectionParams, selection);
          }}
        >
          Start
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const GenericSettings = connector(GenericSettingsComp);
