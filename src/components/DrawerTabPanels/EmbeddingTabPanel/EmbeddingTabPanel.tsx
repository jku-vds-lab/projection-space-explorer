import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import * as React from 'react';
import { Box, Button, Chip, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { EntityId } from '@reduxjs/toolkit';
import { ProjectionControlCard } from './ProjectionControlCard';
import { setProjectionOpenAction } from '../../Ducks/ProjectionOpenDuck';
import { setProjectionWorkerAction } from '../../Ducks/ProjectionWorkerDuck';
import { ADataset, Dataset } from '../../../model/Dataset';
import { GenericSettings } from './GenericSettings';
import type { RootState } from '../../Store/Store';
import { TSNEEmbeddingController } from './TSNEEmbeddingController';
import { UMAPEmbeddingController } from './UMAPEmbeddingController';
import { ClusterTrailSettings } from './ClusterTrailSettings';
import { setTrailVisibility } from '../../Ducks/TrailSettingsDuck';
import { ForceAtlas2EmbeddingController } from './ForceAtlas2EmbeddingController';
import { IProjection, IBaseProjection, ProjectionMethod, IPosition } from '../../../model/ProjectionInterfaces';
import { FeatureConfig, DEFAULT_EMBEDDINGS, EmbeddingMethod } from '../../../BaseConfig';
import { EditProjectionDialog } from './EditProjectionDialog';
import { ViewActions, ViewSelector } from '../../Ducks/ViewDuck';
import { FeatureType } from '../../../model';
import { SelectFeatureComponent } from '../StatesTabPanel/SelectFeatureComponent';
import { setProjectionColumnsAction } from '../../Ducks';

const mapStateToProps = (state: RootState) => ({
  // currentAggregation: state.currentAggregation,
  stories: state.stories,
  projectionWorker: state.projectionWorker,
  projectionOpen: state.projectionOpen,
  dataset: state.dataset,
  // projectionParams: state.projectionParams,
  projections: state.multiples.projections,
  projectionParams: state.projectionParams,
});

const mapDispatchToProps = (dispatch) => ({
  setProjectionOpen: (value) => dispatch(setProjectionOpenAction(value)),
  setProjectionWorker: (value) => dispatch(setProjectionWorkerAction(value)),
  // setProjectionParams: value => dispatch(setProjectionParamsAction(value)),
  setProjectionColumns: (value) => dispatch(setProjectionColumnsAction(value)),
  setTrailVisibility: (visibility) => dispatch(setTrailVisibility(visibility)),
  addProjection: (embedding) => dispatch(ViewActions.add(embedding)),
  deleteProjection: (handle: string) => dispatch(ViewActions.remove(handle)),
  updateWorkspace: (workspace: IBaseProjection, metadata?) => dispatch(ViewActions.updateActive({ positions: workspace, metadata })),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  config: FeatureConfig;
  projectionWorker?: Worker;
  projectionOpen?: boolean;
  setProjectionOpen?: any;
  setProjectionWorker?: any;
  dataset?: Dataset;
};

function EmbeddingMethodButtons(props: { setOpen; setDomainSettings; embeddings?: EmbeddingMethod[] }) {
  const embeddings = props.embeddings ?? DEFAULT_EMBEDDINGS;

  return (
    <Grid container direction="column" spacing={1}>
      {embeddings.map((emb) => (
        <Grid key={emb.id} item>
          <Button
            data-cy={`embedding-${emb.id}`}
            style={{
              width: '100%',
            }}
            variant="outlined"
            onClick={() => {
              props.setDomainSettings(emb);
              props.setOpen(true);
            }}
          >
            {emb.name}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

export const EmbeddingTabPanel = connector((props: Props) => {
  const [open, setOpen] = React.useState(false);
  const [domainSettings, setDomainSettings] = React.useState({
    id: '',
    name: '',
    embController: null,
  });
  const [controller, setController] = React.useState(null);
  const [projectionToEdit, setProjectionToEdit] = React.useState<IProjection>(null);
  const [step, setStep] = React.useState(0);
  const stepRef = React.useRef(0);

  const dispatch = useDispatch();

  const workspace = useSelector(ViewSelector.getWorkspace);
  const workspaceIsTemporal = useSelector(ViewSelector.workspaceIsTemporal);
  const dataset = useSelector((state: RootState) => state.dataset);

  let numericFeatures = null;
  if (dataset) {
    numericFeatures = Object.keys(dataset.columns).filter((key) => dataset.columns[key].featureType === FeatureType.Quantitative);
  }

  React.useEffect(() => {
    if (controller) {
      controller.terminate();
    }
    setController(null);
    props.setTrailVisibility(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dataset]);

  const onSaveProjectionClick = () => {
    dispatch(ViewActions.copyFromWorkspace());
  };

  const onProjectionClick = (projection: IProjection) => {
    dispatch(ViewActions.loadById(projection.hash));
  };

  const onDeleteEditProjectDialog = (handle: string) => {
    props.deleteProjection(handle);
    setProjectionToEdit(null);
  };

  const onCloseEditProjectionDialog = () => {
    setProjectionToEdit(null);
  };

  const onSaveEditProjectionDialog = (key: EntityId, changes: any) => {
    dispatch(ViewActions.save({ id: key, changes }));
    setProjectionToEdit(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EditProjectionDialog
        projection={projectionToEdit}
        onClose={onCloseEditProjectionDialog}
        onSave={onSaveEditProjectionDialog}
        onDelete={onDeleteEditProjectDialog}
      />

      <Box paddingLeft={2} paddingTop={2}>
        <Typography variant="subtitle2" gutterBottom>
          Projection Methods
        </Typography>
      </Box>

      <Box paddingLeft={2} paddingRight={2}>
        <EmbeddingMethodButtons setOpen={setOpen} setDomainSettings={setDomainSettings} embeddings={props.config?.embeddings} />
      </Box>

      <Box p={1}>
        <ProjectionControlCard
          dataset_name={props.dataset?.info?.path}
          controller={controller}
          onClose={() => {
            if (controller) {
              controller.terminate();
            }
            setController(null);
            props.setTrailVisibility(false);
          }}
          onComputingChanged={() => {}}
          onStep={(step) => {
            stepRef.current += 1;
            setStep(stepRef.current);
          }}
        />
      </Box>

      <GenericSettings
        // projectionParams={props.projectionParams}
        domainSettings={domainSettings}
        open={open}
        onClose={() => setOpen(false)}
        onStart={(params, selection) => {
          const checked_sel = selection.filter((s) => s.checked);
          if (checked_sel.length <= 0) {
            alert('Select at least one feature.');
            return;
          }

          stepRef.current = 0;
          setOpen(false);
          props.setProjectionColumns(selection);

          const seed = ADataset.getSpatialData(dataset, workspace.xChannel, workspace.yChannel, workspace.positions);

          // props.setProjectionParams(params)

          switch (domainSettings.id) {
            case ProjectionMethod.TSNE: {
              const controller = new TSNEEmbeddingController();
              controller.init(props.dataset, selection, params, seed);
              const paramsCopy = { ...params };
              controller.stepper = (Y) => {
                const workspace = Y.map((y) => ({ x: y[0], y: y[1] }));
                props.updateWorkspace(workspace, { ...paramsCopy, iterations: stepRef.current, features: [...selection] });
              };

              setController(controller);
              break;
            }

            case ProjectionMethod.UMAP: {
              console.log(workspace);
              const controller = new UMAPEmbeddingController();
              const paramsCopy = { ...params };
              controller.init(props.dataset, selection, params, seed);
              controller.stepper = (Y) => {
                const workspace = props.dataset.vectors.map((sample, i) => {
                  return {
                    x: Y[i][0],
                    y: Y[i][1],
                  };
                });
                props.updateWorkspace(workspace, { ...paramsCopy, iterations: stepRef.current, features: [...selection] });
              };

              setController(controller);
              break;
            }
            case ProjectionMethod.FORCEATLAS2: {
              const controller = new ForceAtlas2EmbeddingController();
              controller.init(props.dataset, selection, params);
              const paramsCopy = { ...params };
              controller.stepper = (Y) => {
                const workspace = props.dataset.vectors.map((sample) => {
                  const idx = controller.nodes[sample.__meta__.duplicateOf].__meta__.meshIndex;
                  return {
                    x: Y[idx].x,
                    y: Y[idx].y,
                  };
                });

                props.updateWorkspace(workspace, { ...paramsCopy, iterations: stepRef.current, features: [...selection] });
              };

              setController(controller);
              break;
            }
            default: {
              // custom embedding controller
              if (domainSettings.embController) {
                const controller = domainSettings.embController;
                const paramsCopy = { ...params };
                controller.init(props.dataset, selection, params, workspace);
                controller.stepper = (Y: IBaseProjection) => {
                  props.updateWorkspace(Y, { ...paramsCopy, method: ProjectionMethod.CUSTOM, iterations: stepRef.current, features: [...selection] });
                };

                setController(controller);
              }
              break;
            }
          }
        }}
      />

      <Box paddingLeft={2} paddingTop={2}>
        <Typography variant="subtitle2" gutterBottom>
          Projection Settings
        </Typography>
      </Box>

      <Box paddingLeft={2} paddingRight={2}>
        <ClusterTrailSettings />
      </Box>

      <Box paddingLeft={2} paddingRight={2} display="flex" style={{ flexDirection: 'column', gap: '8px' }}>
        {dataset && numericFeatures && workspace ? (
          <SelectFeatureComponent
            column_info={dataset.columns}
            label="x channel"
            default_val={workspace.xChannel}
            categoryOptions={numericFeatures}
            onChange={(newValue) => {
              dispatch(ViewActions.selectChannel({ dataset, channel: 'x', value: newValue }));
            }}
          />
        ) : null}

        {dataset && numericFeatures && workspace ? (
          <SelectFeatureComponent
            column_info={dataset.columns}
            label="y channel"
            default_val={workspace.yChannel}
            categoryOptions={numericFeatures}
            onChange={(newValue) => {
              dispatch(ViewActions.selectChannel({ dataset, channel: 'y', value: newValue }));
            }}
          />
        ) : null}
      </Box>

      <Box padding={1}>
        <Typography variant="subtitle2" gutterBottom>
          Visible Projection
        </Typography>
        <ListItem
          key={workspace?.hash}
          selected={workspaceIsTemporal === true}
          secondaryAction={workspaceIsTemporal ? <Chip label="Temporal" variant="outlined" /> : <Chip label="Stored" />}
        >
          {workspaceIsTemporal ? (
            <ListItemText primary={<strong>{workspace?.metadata.method.toUpperCase()}</strong>} secondary={`Iteration ${step}`} />
          ) : (
            <ListItemText primary={<strong>{workspace?.metadata.method.toUpperCase()}</strong>} secondary={`loaded from ${workspace?.name}`} />
          )}
        </ListItem>
      </Box>

      <Box paddingLeft={2} paddingRight={2}>
        <Button onClick={() => onSaveProjectionClick()} variant="outlined" size="small">
          Store Visible Projection
        </Button>
      </Box>

      <Box paddingLeft={2} paddingTop={2}>
        <Typography variant="subtitle2" gutterBottom>
          Stored Projections
        </Typography>
      </Box>

      <div style={{ overflowY: 'auto', height: '100px', flex: '1 1 auto' }}>
        <List dense>
          {props.projections.ids.map((key) => {
            const projection = props.projections.entities[key];
            return (
              <ListItem
                key={projection.hash}
                button
                onClick={() => onProjectionClick(projection)}
                selected={workspaceIsTemporal === false && workspace?.hash === projection.hash}
              >
                <ListItemText
                  primary={`${projection.name}`}
                  secondary={
                    projection.metadata.method === ProjectionMethod.RANDOM || projection.metadata.method === ProjectionMethod.DATASET
                      ? 'loaded from dataset'
                      : `${projection.metadata?.iterations} iterations`
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => setProjectionToEdit(props.projections.entities[key])}>
                    <SettingsIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </div>
    </div>
  );
});
