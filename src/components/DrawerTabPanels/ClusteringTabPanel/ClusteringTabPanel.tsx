/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { EntityId } from '@reduxjs/toolkit';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
  Select,
  Slider,
  styled,
  Switch,
  TextField,
  Typography,
  FormHelperText,
} from '@mui/material';
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { trackPromise } from 'react-promise-tracker';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ACluster } from '../../../model/Cluster';
import { ICluster } from '../../../model/ICluster';
import { IBook } from '../../../model/Book';
import { DisplayMode, setDisplayMode } from '../../Ducks/DisplayModeDuck';
import type { RootState } from '../../Store/Store';
import { StoryPreview } from './StoryPreview';
import * as backend_utils from '../../../utils/backend-connect';
import { useCancellablePromise } from '../../../utils/promise-helpers';
import { setChannelColor } from '../../Ducks/ChannelColorDuck';
import { GroupVisualizationMode, setGroupVisualizationMode } from '../../Ducks/GroupVisualizationMode';
import { selectClusters } from '../../Ducks/AggregationDuck';
import { CategoryOptionsAPI } from '../../WebGLView/CategoryOptions';
import { Dataset } from '../../../model/Dataset';
import { StoriesActions, AStorytelling, IStorytelling, clusterAdapter } from '../../Ducks/StoriesDuck';
import { PointColorScaleActions } from '../../Ducks';
import { ViewSelector } from '../../Ducks/ViewDuck';

const mapStateToProps = (state: RootState) => ({
  stories: state.stories,
  displayMode: state.displayMode,
  dataset: state.dataset,
  currentAggregation: state.currentAggregation,
  groupVisualizationMode: state.groupVisualizationMode,
  workspace: ViewSelector.getWorkspace(state),
});

const mapDispatchToProps = (dispatch) => ({
  setStories: (stories: IBook[]) => dispatch(StoriesActions.set(stories)),
  setActiveStory: (book: EntityId) => dispatch(StoriesActions.setActiveStoryBook(book)),
  setDisplayMode: (displayMode) => dispatch(setDisplayMode(displayMode)),
  addStory: (book: IBook) => dispatch(StoriesActions.addBookAsync({ book, activate: true })),
  removeClusterFromStories: (cluster: ICluster) => dispatch(StoriesActions.deleteCluster(cluster)),
  setChannelColor: (col) => dispatch(setChannelColor(col)),
  setGroupVisualizationMode: (groupVisualizationMode) => dispatch(setGroupVisualizationMode(groupVisualizationMode)),
  setSelectedClusters: (clusters: string[], shift: boolean) => dispatch(selectClusters(clusters, shift)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  splitRef;
  baseUrl: string;
};

const ContextPaper = styled(Paper)`
  padding: 10px;
`;

export const ClusteringTabPanel = connector(
  ({
    setChannelColor,
    setStories,
    dataset,
    stories,
    setDisplayMode,
    displayMode,
    addStory,
    removeClusterFromStories,
    workspace,
    currentAggregation,
    splitRef,
    groupVisualizationMode,
    setGroupVisualizationMode,
    setSelectedClusters,
    baseUrl,
  }: Props) => {
    const categoryOptions = dataset?.categories;

    const dispatch = useDispatch();

    function calc_hdbscan(min_cluster_size, min_cluster_samples, allow_single_cluster, cancellablePromise, clusterSelectionOnly, addClusterToCurrentStory) {
      const loading_area = 'global_loading_indicator';

      const data_points =
        clusterSelectionOnly && currentAggregation.aggregation && currentAggregation.aggregation.length > 0
          ? currentAggregation.aggregation.map((i) => ({
              ...workspace.positions[i],
              meshIndex: i,
            }))
          : dataset.vectors.map((v, i) => ({ ...workspace.positions[i], meshIndex: i }));

      const points = data_points.map((point) => [point.x, point.y]);

      trackPromise(
        cancellablePromise(backend_utils.calculate_hdbscan_clusters(points, min_cluster_size, min_cluster_samples, allow_single_cluster, baseUrl))
          .then((data) => {
            const cluster_labels = data.result;
            const dist_cluster_labels = cluster_labels.filter((value, index, self) => {
              return self.indexOf(value) === index;
            }); // return distinct list of clusters

            if (dist_cluster_labels.length <= 1) {
              // if there are no clusters found, return and give error message
              alert('No Cluster could be derived. Please, adjust the Clustering Settings and try again.');
              return;
            }

            const story: IBook = AStorytelling.emptyStory({ method: 'hdbscan' });
            const clusters: ICluster[] = new Array<ICluster>();

            dist_cluster_labels.forEach((cluster_label) => {
              if (cluster_label >= 0) {
                const current_cluster_vects = data_points.filter((x, i) => cluster_labels[i] === cluster_label);
                const cluster = ACluster.fromSamples(
                  dataset,
                  current_cluster_vects.map((i) => i.meshIndex),
                  { method: 'hdbscan' },
                );

                // Set correct label for cluster
                cluster.label = cluster_label;

                clusters.push(cluster);
              }
            });

            story.clusters = clusterAdapter.addMany(story.clusters, clusters);

            /** story.clusters.entities = clusters.reduce((prev, cur) => {
              prev[cur.id] = cur;
              return prev;
            }, {});
            story.clusters.ids = Object.keys(story.clusters.entities); * */

            // if(!addClusterToCurrentStory){
            addStory(story);
            // }

            // Update UI, dont know how to right now
            const clusterAttribute = CategoryOptionsAPI.getAttribute(categoryOptions, 'color', 'groupLabel', 'categorical');

            if (clusterAttribute) {
              setChannelColor(clusterAttribute);

              dispatch(PointColorScaleActions.initScaleByType(clusterAttribute.type));
            }
          })
          .catch((error) => console.log(error)),
        loading_area,
      );
    }

    const { cancellablePromise } = useCancellablePromise();

    const [openClusterPanel, setOpenClusterPanel] = React.useState(false);
    const anchorRef = React.useRef();

    const [clusterSelectionOnly, setClusterSelectionOnly] = React.useState(false);
    const [addClusterToCurrentStory, setAddClusterToCurrentStory] = React.useState(false);

    const [clusterAdvancedMode, setClusterAdvancedMode] = React.useState(false);
    const [clusterSliderValue, setClusterSliderValue] = React.useState(2);

    const [min_cluster_size, set_min_cluster_size] = React.useState(5);
    const [min_cluster_samples, set_min_cluster_samples] = React.useState(1);
    const [allow_single_cluster, set_allow_single_cluster] = React.useState(false);

    const handleClusterSliderChange = (newValue, clusterSelectionOnly) => {
      const data =
        clusterSelectionOnly && currentAggregation.aggregation && currentAggregation.aggregation.length > 0 ? currentAggregation.aggregation : dataset.vectors;
      let min_clust = 0;
      switch (newValue) {
        case 0: {
          const c_few = 11;
          min_clust = Math.log10(data.length) * c_few;
          // min_clust = Math.max(data.length / 200, 20);
          set_min_cluster_size(Math.round(min_clust));
          set_min_cluster_samples(Math.round(min_clust / 2));
          // set_allow_single_cluster(true);
          set_allow_single_cluster(false);
          break;
        }
        case 1: {
          const c_med = 6;
          min_clust = Math.log10(data.length) * c_med;
          // min_clust = Math.max(data.length / 500, 9);
          set_min_cluster_size(Math.round(min_clust));
          set_min_cluster_samples(Math.round(min_clust / 2));
          set_allow_single_cluster(false);
          break;
        }
        case 2: {
          const c_many = 3;
          min_clust = Math.log10(data.length) * c_many;
          // min_clust = Math.max(data.length / 700, 5);
          set_min_cluster_size(Math.round(min_clust));
          set_min_cluster_samples(Math.round(min_clust / 5));
          set_allow_single_cluster(false);
          break;
        }
        default:
          break;
      }
      setClusterSliderValue(newValue);
    };

    React.useEffect(() => {
      handleClusterSliderChange(clusterSliderValue, clusterSelectionOnly);
    }, [dataset?.info?.path, currentAggregation, clusterSelectionOnly]);

    const marks = [
      {
        value: 0,
        label: 'Few Clusters',
      },
      {
        value: 2,
        label: 'Many Clusters',
      },
    ];
    // React.useEffect(() => toggleClusters(), [dataset])

    const onCheckItems = (event) => {
      if (event.target.checked) {
        if (displayMode === DisplayMode.OnlyClusters) {
          setDisplayMode(DisplayMode.StatesAndClusters);
        } else {
          setDisplayMode(DisplayMode.OnlyStates);
        }
      } else if (displayMode === DisplayMode.StatesAndClusters) {
        setDisplayMode(DisplayMode.OnlyClusters);
      } else {
        setDisplayMode(DisplayMode.None);
      }
    };

    const onCheckClusters = (event) => {
      if (event.target.checked) {
        if (displayMode === DisplayMode.OnlyStates) {
          setDisplayMode(DisplayMode.StatesAndClusters);
        } else {
          setDisplayMode(DisplayMode.OnlyClusters);
        }
      } else if (displayMode === DisplayMode.StatesAndClusters) {
        setDisplayMode(DisplayMode.OnlyStates);
      } else {
        setDisplayMode(DisplayMode.None);
      }
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box paddingLeft={2} paddingTop={2}>
          <Typography variant="subtitle2" gutterBottom>
            Group Settings
          </Typography>
        </Box>

        <Box paddingLeft={2} paddingRight={2}>
          <FormControlLabel
            control={<Switch color="primary" checked={displayMode !== DisplayMode.OnlyClusters && displayMode !== DisplayMode.None} onChange={onCheckItems} />}
            label="Show Items"
          />
          <FormControlLabel
            control={<Switch color="primary" checked={displayMode !== DisplayMode.OnlyStates && displayMode !== DisplayMode.None} onChange={onCheckClusters} />}
            label="Show Group Centers"
          />

          <div style={{ width: '100%' }}>
            <FormControl style={{ width: '100%' }}>
              <FormHelperText>Group Visualization</FormHelperText>
              <Select
                value={groupVisualizationMode}
                onChange={(event) => {
                  setGroupVisualizationMode(event.target.value);
                }}
                displayEmpty
                size="small"
              >
                <MenuItem value={GroupVisualizationMode.None}>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={GroupVisualizationMode.ConvexHull}>Contour Plot</MenuItem>
                <MenuItem value={GroupVisualizationMode.StarVisualization}>Star Visualization</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Box>

        <Box paddingLeft={2} paddingTop={2} paddingRight={2}>
          <Button variant="outlined" fullWidth ref={anchorRef} onClick={() => setOpenClusterPanel(true)}>
            Define Groups by Clustering <ChevronRightIcon />
          </Button>
        </Box>
        <Popover
          open={openClusterPanel}
          anchorEl={anchorRef.current}
          onClose={() => setOpenClusterPanel(false)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box paddingLeft={2} paddingTop={2} width={300}>
            <Typography variant="subtitle2" gutterBottom>
              Clustering Settings
            </Typography>
          </Box>

          <Box paddingLeft={2}>
            <FormControlLabel
              control={
                <Switch
                  color="primary"
                  checked={clusterAdvancedMode}
                  onChange={(event, newValue) => {
                    setClusterAdvancedMode(newValue);
                  }}
                  name="advancedClustering"
                />
              }
              label="Advanced"
            />
          </Box>
          {clusterAdvancedMode ? (
            <Box paddingLeft={2} paddingRight={2}>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      color="primary"
                      checked={clusterSelectionOnly}
                      onChange={(event, newValue) => {
                        setClusterSelectionOnly(newValue);
                      }}
                      name="selectionClustering"
                    />
                  }
                  label="Cluster only Selected Items"
                />
              </Box>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      color="primary"
                      checked={addClusterToCurrentStory}
                      onChange={(event, newValue) => {
                        setAddClusterToCurrentStory(newValue);
                      }}
                      name="addClusterToCurrentStory"
                    />
                  }
                  label="Add Cluster to current Story"
                />
              </Box>
              <TextField
                fullWidth
                label="Min Cluster Size"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={min_cluster_size}
                onChange={(event) => {
                  set_min_cluster_size(Math.max(parseInt(event.target.value, 10), 2));
                }}
              />
              <br />
              <TextField
                fullWidth
                label="Min Cluster Samples"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={min_cluster_samples}
                onChange={(event) => {
                  set_min_cluster_samples(Math.max(parseInt(event.target.value, 10), 1));
                }}
              />
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={allow_single_cluster}
                    onChange={(event) => {
                      set_allow_single_cluster(event.target.checked);
                    }}
                  />
                }
                label="Allow Single Cluster"
              />
            </Box>
          ) : (
            <Box paddingLeft={7} paddingRight={7}>
              <Slider
                track={false}
                defaultValue={1}
                aria-labelledby="discrete-slider-custom"
                step={1}
                marks={marks}
                min={0}
                max={2}
                value={clusterSliderValue}
                onChange={(event, newValue) => handleClusterSliderChange(newValue, clusterSelectionOnly)}
              />
            </Box>
          )}
          <Box p={2}>
            <Button
              variant="outlined"
              style={{
                width: '100%',
              }}
              onClick={() => {
                calc_hdbscan(min_cluster_size, min_cluster_samples, allow_single_cluster, cancellablePromise, clusterSelectionOnly, addClusterToCurrentStory);
                setOpenClusterPanel(false);
              }}
            >
              Run Clustering{/* Projection-based Clustering */}
            </Button>
          </Box>
        </Popover>

        <Box paddingLeft={2} paddingTop={2}>
          <Typography variant="subtitle2" gutterBottom>
            Groups and Stories
          </Typography>
        </Box>

        <Box paddingLeft={2} paddingRight={2} paddingBottom={2}>
          <StoryPreview />
        </Box>

        <div style={{ overflowY: 'auto', height: '100px', flex: '1 1 auto' }}>
          <ClusterList
            dataset={dataset}
            removeClusterFromStories={removeClusterFromStories}
            selectedClusters={currentAggregation.selectedClusters}
            stories={stories}
            splitRef={splitRef}
            setSelectedCluster={setSelectedClusters}
          />
        </div>
      </div>
    );
  },
);

type ClusterPopoverProps = {
  anchorEl: any;
  setAnchorEl: any;
  cluster: ICluster;
  removeClusterFromStories: any;
  splitRef: any;
  dataset: Dataset;
};

function ClusterPopover({ anchorEl, setAnchorEl, cluster, dataset, removeClusterFromStories, splitRef }: ClusterPopoverProps) {
  if (!cluster) return null;

  const [name, setName] = React.useState(cluster.label);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (cluster && anchorEl) {
      setName(cluster.label);
    }
  }, [anchorEl, cluster]);

  const onSave = () => {
    dispatch(StoriesActions.changeClusterName({ cluster: cluster.id, name }));

    setAnchorEl(null);
  };

  const onDelete = () => {
    setAnchorEl(null);
    removeClusterFromStories(cluster);
  };

  const onLineup = () => {
    setAnchorEl(null);

    const curr_sizes = splitRef.current.split.getSizes();
    if (curr_sizes[1] < 2) {
      splitRef.current.split.setSizes([30, 70]);
    }
  };

  return (
    <Popover
      id="dialog to open"
      open={anchorEl !== null}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <div>
        <ContextPaper>
          {/* <Typography variant="h6" className={classes.button} gutterBottom>Settings</Typography> */}

          <Button
            variant="outlined"
            // color="secondary"
            onClick={onDelete}
            startIcon={<DeleteIcon />}
          >
            Delete Group
          </Button>

          <FormGroup>
            <TextField
              id="option3"
              label="Group Name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              margin="normal"
            />

            <div style={{ display: 'flex' }}>
              <Button color="primary" variant="contained" aria-label="Save" onClick={onSave} startIcon={<SaveIcon />}>
                Save
                {/* Name */}
              </Button>
              <Button onClick={onLineup} variant="outlined">
                Show Group in Table
              </Button>
            </div>
          </FormGroup>
        </ContextPaper>
      </div>
    </Popover>
  );
}

type ClusterListProps = {
  selectedClusters: EntityId[];
  stories: IStorytelling;
  removeClusterFromStories;
  splitRef;
  setSelectedCluster;
  dataset;
};

function ClusterList({ selectedClusters, stories, dataset, removeClusterFromStories, splitRef, setSelectedCluster }: ClusterListProps) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [popoverCluster, setPopoverCluster] = React.useState<ICluster>(null);

  const activeStory = AStorytelling.getActive(stories);

  const storyItems = new Array<JSX.Element>();

  if (activeStory) {
    for (const key of activeStory.clusters.ids) {
      const cluster = activeStory.clusters.entities[key];

      storyItems.push(
        <ListItem
          key={key}
          button
          selected={selectedClusters.includes(key)}
          onClick={(event) => {
            setSelectedCluster([key], event.ctrlKey);
          }}
        >
          <ListItemText primary={ACluster.getTextRepresentation(cluster)} secondary={`${cluster.indices.length} Items`} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(event) => {
                // removeClusterFromStories(cluster)
                setPopoverCluster(cluster);
                setAnchorEl(event.target);
              }}
            >
              <SettingsIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>,
      );
    }
  }

  return (
    <div>
      <ClusterPopover
        anchorEl={anchorEl}
        dataset={dataset}
        setAnchorEl={setAnchorEl}
        cluster={popoverCluster}
        removeClusterFromStories={removeClusterFromStories}
        splitRef={splitRef}
      />

      <List>{storyItems}</List>
    </div>
  );
}
