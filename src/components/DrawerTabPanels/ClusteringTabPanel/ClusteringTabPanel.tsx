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
  Tooltip,
  DialogTitle,
  Grid,
  Divider,
} from '@mui/material';
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { trackPromise } from 'react-promise-tracker';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { InfoOutlined } from '@mui/icons-material';
import { ACluster } from '../../../model/Cluster';
import { ICluster } from '../../../model/ICluster';
import { IBook } from '../../../model/Book';
import { DisplayMode, setDisplayMode } from '../../Ducks/DisplayModeDuck';
import { RootState, usePSESelector } from '../../Store/Store';
import { StoryPreview } from './StoryPreview';
import * as backend_utils from '../../../utils/backend-connect';
import { useCancellablePromise } from '../../../utils/promise-helpers';
import { setChannelColor } from '../../Ducks/ChannelColorDuck';
import { GroupVisualizationMode, setGroupVisualizationMode } from '../../Ducks/GroupVisualizationMode';
import { selectClusters } from '../../Ducks/AggregationDuck';
import { CategoryOptionsAPI } from '../../WebGLView/CategoryOptions';
import { ADataset, Dataset } from '../../../model/Dataset';
import { StoriesActions, AStorytelling, IStorytelling, clusterAdapter } from '../../Ducks/StoriesDuck';
import { PointColorScaleActions } from '../../Ducks';
import { ViewSelector } from '../../Ducks/ViewDuck';
import { capitalizeFirstLetter } from '../../../utils/helpers';

const mapStateToProps = (state: RootState) => ({
  stories: state.stories,
  displayMode: state.displayMode,
  dataset: state.dataset,
  currentAggregation: state.currentAggregation,
  groupVisualizationMode: state.groupVisualizationMode,
  workspace: ViewSelector.getWorkspace(state),
  globalLabels: state.globalLabels,
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
    globalLabels,
  }: Props) => {
    const categoryOptions = dataset?.categories;

    const dispatch = useDispatch();

    function calc_hdbscan(min_cluster_size, min_cluster_samples, allow_single_cluster, cancellablePromise, clusterSelectionOnly, addClusterToCurrentStory) {
      const loading_area = 'global_loading_indicator';

      const spatial = ADataset.getSpatialData(dataset, workspace.xChannel, workspace.yChannel, workspace.positions);

      const data_points =
        clusterSelectionOnly && currentAggregation.aggregation && currentAggregation.aggregation.length > 0
          ? currentAggregation.aggregation.map((i) => ({
              ...spatial[i],
              meshIndex: i,
            }))
          : dataset.vectors.map((v, i) => ({ ...spatial[i], meshIndex: i }));

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
          .catch((error) => console.error(error)),
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
        label: 'Few groups',
      },
      {
        value: 2,
        label: 'Many groups',
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
        <Box paddingX={2} paddingTop={2} paddingBottom={1}>
          <Typography variant="subtitle2" gutterBottom>
            Group settings
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Manually or automatically define groups of {globalLabels.itemLabelPlural}.{' '}
            <Tooltip
              title={
                <Typography variant="subtitle2">
                  You can visualize the groups in the scatterplot, interact with them, and use them to create {globalLabels.storyLabelPlural}. To manually
                  define groups, select the {globalLabels.itemLabelPlural} you want to group, right-click to open the context menu and select &quot;Define group
                  from selection&quot;.
                </Typography>
              }
            >
              <InfoOutlined fontSize="inherit" />
            </Tooltip>
          </Typography>
        </Box>

        <Box paddingLeft={2} paddingRight={2}>
          <Tooltip placement="right" title={<Typography>Turn off toggle to hide {globalLabels.itemLabelPlural} in the scatterplot.</Typography>}>
            <FormControlLabel
              control={
                <Switch color="primary" checked={displayMode !== DisplayMode.OnlyClusters && displayMode !== DisplayMode.None} onChange={onCheckItems} />
              }
              label={`Show ${globalLabels.itemLabelPlural}`}
            />
          </Tooltip>
          <Tooltip placement="right" title={<Typography>Turn off toggle to hide group centers in the scatterplot.</Typography>}>
            <FormControlLabel
              control={
                <Switch color="primary" checked={displayMode !== DisplayMode.OnlyStates && displayMode !== DisplayMode.None} onChange={onCheckClusters} />
              }
              label="Show group centers"
            />
          </Tooltip>

          <div style={{ width: '100%' }}>
            <FormControl style={{ width: '100%' }}>
              <FormHelperText>
                Group visualization{' '}
                <Tooltip
                  title={
                    <Typography variant="subtitle2">Choose how a selected group visualizes the membership of its {globalLabels.itemLabelPlural}.</Typography>
                  }
                >
                  <InfoOutlined fontSize="inherit" />
                </Tooltip>
              </FormHelperText>
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
                <MenuItem value={GroupVisualizationMode.ConvexHull}>Contour plot</MenuItem>
                <MenuItem value={GroupVisualizationMode.StarVisualization}>Star visualization</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Box>

        <Box paddingLeft={2} paddingTop={2} paddingRight={2}>
          <Tooltip
            title={
              <Typography variant="subtitle2">
                Automatically derive groups using the HDBSCAN clustering algorithm. The clustering alogrithm takes the two-dimensional coordinates as input and
                returns density-based group affiliations for each {globalLabels.itemLabel}.
              </Typography>
            }
          >
            <Button variant="outlined" fullWidth ref={anchorRef} onClick={() => setOpenClusterPanel(true)} data-cy="define-groups-by-clustering-button">
              Define groups by clustering <ChevronRightIcon />
            </Button>
          </Tooltip>
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
          <DialogTitle>Clustering settings</DialogTitle>

          <Box paddingLeft={2} width={300}>
            <Typography variant="body2" gutterBottom>
              Adjust parameters used for HDBSCAN clustering.
            </Typography>
          </Box>

          <Box paddingLeft={2}>
            <Tooltip placement="left" title={<Typography variant="subtitle2">Use advanced parameter settings, if you know what you are doing.</Typography>}>
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
            </Tooltip>
          </Box>
          {clusterAdvancedMode ? (
            <Box paddingLeft={2} paddingRight={2}>
              <Tooltip placement="left" title={<Typography variant="subtitle2">The minimum number of {globalLabels.itemLabelPlural} in a cluster.</Typography>}>
                <TextField
                  fullWidth
                  label="Min cluster size"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={min_cluster_size}
                  onChange={(event) => {
                    set_min_cluster_size(Math.max(parseInt(event.target.value, 10), 2));
                  }}
                  margin="normal"
                />
              </Tooltip>
              <br />
              <Tooltip
                title={
                  <Typography variant="subtitle2">
                    This parameter determines the number of neighboring {globalLabels.itemLabelPlural}&apos; distance to estimate cluster densities.
                  </Typography>
                }
                placement="left"
              >
                <TextField
                  fullWidth
                  label="Min samples"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={min_cluster_samples}
                  onChange={(event) => {
                    set_min_cluster_samples(Math.max(parseInt(event.target.value, 10), 1));
                  }}
                  margin="normal"
                />
              </Tooltip>
              <br />
              <Tooltip
                placement="left"
                title={<Typography variant="subtitle2">If activated, HDBSCAN is allowed to return a single cluster. Otherwise, this is restricted.</Typography>}
              >
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
                  label="Allow single cluster"
                />
              </Tooltip>
            </Box>
          ) : (
            <Box paddingLeft={7} paddingRight={7}>
              <Tooltip placement="left" title={<Typography variant="subtitle2">Choose how many groups should approximately be derived.</Typography>}>
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
              </Tooltip>
            </Box>
          )}

          <Box padding={2}>
            <Divider />
          </Box>
          <Box paddingLeft={2} paddingRight={2}>
            <Tooltip
              placement="left"
              title={
                <Typography variant="subtitle2">
                  If activated, only selected {globalLabels.itemLabelPlural} will be clustered. Otherwise, all {globalLabels.itemLabelPlural} will be clustered.
                </Typography>
              }
            >
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
                label={`Cluster selected ${globalLabels.itemLabelPlural} only`}
              />
            </Tooltip>
          </Box>
          <Box paddingLeft={2} paddingRight={2}>
            <Tooltip
              placement="left"
              title={
                <Typography variant="subtitle2">
                  If activated, the derived groups are added to the active {globalLabels.storyBookLabel}. Otherwise, a new {globalLabels.storyBookLabel} is
                  created where the groups are added.
                </Typography>
              }
            >
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
                label={`Add groups to current ${globalLabels.storyLabel}`}
              />
            </Tooltip>
          </Box>
          <Box p={2} textAlign="right">
            <Button onClick={() => setOpenClusterPanel(false)}>Cancel</Button>
            <Button
              data-cy="run-clustering-button"
              onClick={() => {
                calc_hdbscan(min_cluster_size, min_cluster_samples, allow_single_cluster, cancellablePromise, clusterSelectionOnly, addClusterToCurrentStory);
                setOpenClusterPanel(false);
              }}
            >
              Start
            </Button>
          </Box>
        </Popover>

        <Box paddingLeft={2} paddingTop={2}>
          <Typography variant="subtitle2" gutterBottom>
            Groups and {globalLabels.storyBookLabelPlural}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Activate a {globalLabels.storyBookLabel} to view groups and {globalLabels.storyLabelPlural}.{' '}
            <Tooltip
              title={
                <Typography variant="subtitle2">
                  To manually define {globalLabels.storyLabelPlural}, draw directed edges between group centers in the scatter plot. To activate the{' '}
                  {globalLabels.storyTellingLabel} view, right-click on one of the group centers. In the context menu select one of the{' '}
                  {globalLabels.storyLabel} options.
                </Typography>
              }
            >
              <InfoOutlined fontSize="inherit" />
            </Tooltip>
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
            globalLabels={globalLabels}
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
  dataset: Dataset;
};

function ClusterPopover({ anchorEl, setAnchorEl, cluster, removeClusterFromStories, dataset }: ClusterPopoverProps) {
  if (!cluster) return null;

  const [name, setName] = React.useState(cluster.label);
  const dispatch = useDispatch();

  const stories = usePSESelector((state) => state.stories);

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
      <DialogTitle>Settings for group {ACluster.getTextRepresentation(cluster)}</DialogTitle>
      <Box paddingLeft={2} paddingRight={2} paddingBottom={2} width={300}>
        {/* <Typography variant="h6" className={classes.button} gutterBottom>Settings</Typography> */}
        <Box paddingBottom={0}>
          <Tooltip title={<Typography variant="subtitle2">Delete group {ACluster.getTextRepresentation(cluster)}</Typography>}>
            <Button variant="outlined" fullWidth color="error" onClick={onDelete} startIcon={<DeleteIcon />}>
              Delete
            </Button>
          </Tooltip>
        </Box>
        <FormGroup>
          <TextField
            label="Rename group"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            margin="normal"
          />
          <Box paddingTop={1} textAlign="right">
            <Button color="primary" aria-label="Close" onClick={() => setAnchorEl(null)}>
              Close
              {/* Name */}
            </Button>
            <Button
              color="primary"
              // variant="outlined"
              aria-label="Save"
              onClick={onSave}
              // startIcon={<SaveIcon />}
            >
              Save
            </Button>
          </Box>
        </FormGroup>
      </Box>
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
  globalLabels;
};

function ClusterList({ selectedClusters, stories, dataset, removeClusterFromStories, splitRef, setSelectedCluster, globalLabels }: ClusterListProps) {
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
          <ListItemText
            primary={ACluster.getTextRepresentation(cluster)}
            secondary={`${cluster.indices.length} ${capitalizeFirstLetter(globalLabels.itemLabelPlural)}`}
          />
          <ListItemSecondaryAction>
            <Tooltip title={<Typography variant="subtitle2">Change settings for this group</Typography>}>
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
            </Tooltip>
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
      />

      <List>{storyItems}</List>
    </div>
  );
}
