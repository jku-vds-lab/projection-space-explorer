/* eslint-disable react/display-name */
import 'regenerator-runtime/runtime';
import './index.scss';
import { Divider, Drawer, Paper, Tooltip, Typography, Tab, Tabs, Box, Grid } from '@mui/material';
import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import Split from 'react-split';
import { Dataset } from './model/Dataset';
import { Storytelling } from './components/Overlays/Storytelling';
import { ClusteringTabPanel } from './components/DrawerTabPanels/ClusteringTabPanel/ClusteringTabPanel';
import { StatesTabPanel } from './components/DrawerTabPanels/StatesTabPanel/StatesTabPanel';
import { StateSequenceDrawerRedux } from './components/Overlays/StateSequenceDrawer';
import { TabActions } from './components/Ducks/OpenTabDuck';
import { EmbeddingTabPanel } from './components/DrawerTabPanels/EmbeddingTabPanel/EmbeddingTabPanel';
import { CSVLoader } from './components/Utility/Loaders/CSVLoader';
import { DatasetTabPanel } from './components/DrawerTabPanels/DatasetTabPanel/DatasetTabPanel';
import { DetailsTabPanel } from './components/DrawerTabPanels/DetailsTabPanel/DetailsTabPanel';
import { setLineByOptions } from './components/Ducks/SelectedLineByDuck';
import { setGlobalPointBrightness } from './components/Ducks/GlobalPointBrightnessDuck';
import { setGroupVisualizationMode } from './components/Ducks/GroupVisualizationMode';
import { HoverStateOrientation } from './components/Ducks/HoverStateOrientationDuck';
import { PluginRegistry } from './components/Store/PluginScript';
import type { RootState } from './components/Store/Store';
import { RubikPlugin } from './plugins/Rubik/RubikPlugin';
import { ChessPlugin } from './plugins/Chess/ChessPlugin';
import { GoPlugin } from './plugins/Go/GoPlugin';
import { PseAppBar } from './components/PseAppBar';
import { PSEIcons, PSESvgIcon } from './utils/PSEIcons';
// @ts-ignore
import VDSLogo from '../textures/vds-lab-logo-notext.svg';
import { CoralPlugin } from './plugins/Coral/CoralPlugin';
import { DatasetEntriesAPI } from './components/Ducks/DatasetEntriesDuck';
import { JSONLoader } from './components/Utility/Loaders';
import { DatasetType } from './model/DatasetType';
import { RootActions } from './components/Store/RootActions';
import { BaseConfig, FeatureConfig, ComponentConfig } from './BaseConfig';
import { ViewMultiplexer } from './components/ViewMultiplexer/ViewMultiplexer';
import { toSentenceCase } from './utils/helpers';
import { DetailViewChooser } from './components/ViewMultiplexer/DetailViewChooser';
import { DetailViewActions } from './components/Ducks/DetailViewDuck';
import { ViewsTabPanel } from './components/DrawerTabPanels/ViewsTabPanel/ViewsTabPanel';

function TabContainer({ value, icon, dataCy, focusedTab }: { value: number; icon: JSX.Element; dataCy: any; focusedTab: number[] }) {
  return (
    <Tab
      value={value}
      icon={icon}
      data-cy={dataCy}
      style={{
        minWidth: 0,
        flexGrow: 1,
        padding: 12,
        filter: focusedTab?.length > 0 && !focusedTab?.includes(value) ? 'saturate(0)' : '',
        // borderTop: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    />
  );
}

/**
 * A TabPanel with a fixed height of 100vh which is needed for content with a scrollbar to work.
 */
function FixedHeightTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ height: '100%', width: 288 }}
    >
      <Paper style={{ overflow: 'hidden', height: '100%' }}>{children}</Paper>
    </Typography>
  );
}

const mapStateToProps = (state: RootState) => ({
  tab: state.openTab,
  dataset: state.dataset,
  hoverStateOrientation: state.hoverStateOrientation,
  datasetEntries: state.datasetEntries,
  globalLabels: state.globalLabels,
});

const mapDispatchToProps = (dispatch) => ({
  setOpenTab: (openTab) => dispatch(TabActions.setOpenTab(openTab)),
  setLineByOptions: (options) => dispatch(setLineByOptions(options)),
  setGlobalPointBrightness: (value) => dispatch(setGlobalPointBrightness(value)),
  setGroupVisualizationMode: (value) => dispatch(setGroupVisualizationMode(value)),
  setLineUpInput_visibility: (open) => dispatch(DetailViewActions.setDetailVisibility(open)),
  loadDataset: (dataset: Dataset) => dispatch(RootActions.loadDataset(dataset)),
});

/**
 * Factory method which is declared here so we can get a static type in 'ConnectedProps'
 */
const connector = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
});

/**
 * Type that holds the props we declared above in mapStateToProps and mapDispatchToProps
 */
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  config?: BaseConfig;
  features?: FeatureConfig;
  overrideComponents?: ComponentConfig;
};

/**
 * Main application that contains all other components.
 */
export const Application = connector(
  class extends React.Component<Props, any> {
    splitRef: React.LegacyRef<Split>;

    constructor(props) {
      super(props);

      this.splitRef = React.createRef();

      this.onDataSelected = this.onDataSelected.bind(this);
    }

    componentDidMount() {
      if ((this.props.config?.preselect?.initOnMount ?? true) && (this.props.config?.preselect?.url ?? false)) {
        const preselect = this.props.config?.preselect?.url;

        const loader = preselect.endsWith('.csv') ? new CSVLoader() : new JSONLoader();

        const entry = DatasetEntriesAPI.getByPath(this.props.datasetEntries, preselect) ?? {
          type: DatasetType.None,
          path: preselect,
          display: preselect,
        };

        loader.resolvePath(entry, (dataset) => {
          this.onDataSelected(dataset);
        });
      }
    }

    /**
     * Main callback when the dataset changes
     * @param dataset
     * @param json
     */
    onDataSelected(dataset: Dataset) {
      this.props.loadDataset(dataset);
    }

    onChangeTab(newTab) {
      this.props.setOpenTab(newTab);
    }

    render() {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'stretch',
            overflow: 'hidden',
          }}
        >
          <Drawer
            variant="permanent"
            style={{
              width: 88,
            }}
            PaperProps={{
              style: {
                position: 'initial',
                overflow: 'hidden',
                border: 'none',
              },
            }}
          >
            <Divider />
            <Tabs
              style={{
                width: 88,
              }}
              value={this.props.tab.openTab}
              orientation="vertical"
              indicatorColor="primary"
              textColor="primary"
              onChange={(e, newTab) => this.onChangeTab(newTab)}
              aria-label="disabled tabs example"
            >
              <Tooltip
                placement="right"
                title={
                  <>
                    <Typography variant="subtitle2">Load dataset</Typography>
                    <Typography variant="body2">Upload a new dataset or choose a predefined one.</Typography>
                  </>
                }
              >
                <Tab
                  value={0}
                  icon={<PSESvgIcon component={PSEIcons.Dataset} />}
                  data-cy="dataset-tab"
                  disabled={this.props.tab.focusedTab?.length > 0 && !this.props.tab.focusedTab.includes(0)}
                  style={{
                    minWidth: 0,
                    flexGrow: 1,
                    padding: 12,
                    filter: this.props.tab.focusedTab?.length > 0 && !this.props.tab.focusedTab.includes(0) ? 'saturate(0)' : '',
                    // borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                  }}
                />
              </Tooltip>

              <Tooltip
                placement="right"
                title={
                  <>
                    <Typography variant="subtitle2">Embedding and projection</Typography>
                    <Typography variant="body2">Perform projection techniques like t-SNE, UMAP, or a force-directly layout with your data.</Typography>
                  </>
                }
              >
                <Tab
                  value={1}
                  data-cy="projection-tab"
                  icon={<PSESvgIcon component={PSEIcons.Project} />}
                  disabled={this.props.tab.focusedTab?.length > 0 && !this.props.tab.focusedTab.includes(1)}
                  style={{
                    minWidth: 0,
                    flexGrow: 1,
                    padding: 12,
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                    filter: this.props.tab.focusedTab?.length > 0 && !this.props.tab.focusedTab.includes(1) ? 'saturate(0)' : '',
                  }}
                />
              </Tooltip>

              <Tooltip
                placement="right"
                title={
                  <>
                    <Typography variant="subtitle2">Point and line channels</Typography>
                    <Typography variant="body2">
                      Contains settings that let you map different channels like brightness and color on point and line attributes.
                    </Typography>
                  </>
                }
              >
                <Tab
                  value={2}
                  data-cy="encoding-tab"
                  icon={<PSESvgIcon component={PSEIcons.Encoding} />}
                  disabled={this.props.tab.focusedTab?.length > 0 && !this.props.tab.focusedTab.includes(2)}
                  style={{
                    minWidth: 0,
                    flexGrow: 1,
                    padding: 12,
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                    filter: this.props.tab.focusedTab?.length > 0 && !this.props.tab.focusedTab.includes(2) ? 'saturate(0)' : '',
                  }}
                />
              </Tooltip>

              <Tooltip
                placement="right"
                title={
                  <>
                    <Typography variant="subtitle2">Groups</Typography>
                    <Typography variant="body2">Contains options for displaying and navigating groups in the dataset.</Typography>
                  </>
                }
              >
                <Tab
                  value={3}
                  data-cy="groups-tab"
                  icon={<PSESvgIcon component={PSEIcons.Clusters} />}
                  disabled={this.props.tab.focusedTab?.length > 0 && !this.props.tab.focusedTab.includes(3)}
                  style={{
                    minWidth: 0,
                    flexGrow: 1,
                    padding: 12,
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                    filter: this.props.tab.focusedTab?.length > 0 && !this.props.tab.focusedTab.includes(3) ? 'saturate(0)' : '',
                  }}
                />
              </Tooltip>

              <Tooltip
                placement="right"
                title={
                  <>
                    <Typography variant="subtitle2">{`Hovered and selected ${this.props.globalLabels.itemLabel}`}</Typography>
                    <Typography variant="body2">
                      {toSentenceCase(`Contains information about the hovered or selected ${this.props.globalLabels.itemLabelPlural}.`)}
                    </Typography>
                  </>
                }
              >
                <Tab
                  value={4}
                  data-cy="details-tab"
                  icon={<PSESvgIcon component={PSEIcons.Details} />}
                  disabled={this.props.tab.focusedTab?.length > 0 && !this.props.tab.focusedTab.includes(4)}
                  style={{
                    minWidth: 0,
                    flexGrow: 1,
                    padding: 12,
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)',

                    filter: this.props.tab.focusedTab?.length > 0 && !this.props.tab.focusedTab.includes(4) ? 'saturate(0)' : '',
                  }}
                />
              </Tooltip>

              {this.props.features?.showTabularTab !== false && this.props.overrideComponents?.detailViews?.length > 0 ? (
                <Tooltip
                  placement="right"
                  title={
                    <>
                      <Typography variant="subtitle2">{`Tabular views of the ${this.props.globalLabels.itemLabelPlural}`}</Typography>
                      <Typography variant="body2">
                        {toSentenceCase(`Contains settings of the tabular views for the ${this.props.globalLabels.itemLabelPlural}.`)}
                      </Typography>
                    </>
                  }
                >
                  <Tab
                    value={5}
                    data-cy="details-tab"
                    icon={<PSESvgIcon component={PSEIcons.PseLineup} />}
                    disabled={this.props.tab.focusedTab?.length > 0 && !this.props.tab.focusedTab.includes(5)}
                    style={{
                      minWidth: 0,
                      flexGrow: 1,
                      padding: 12,
                      borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                      filter: this.props.tab.focusedTab?.length > 0 && !this.props.tab.focusedTab.includes(5) ? 'saturate(0)' : '',
                    }}
                  />
                </Tooltip>
              ) : null}

              {this.props.overrideComponents?.tabs?.map((tab, i) => {
                return (
                  <Tooltip
                    key={`tooltip${tab.name}`}
                    placement="right"
                    title={
                      <>
                        <Typography variant="subtitle2">{tab.title}</Typography>
                        <Typography variant="body2">{tab.description}</Typography>
                      </>
                    }
                  >
                    <Tab
                      value={6 + i}
                      icon={<PSESvgIcon component={tab.icon as any} />}
                      data-cy={`custom-tab-${i}`}
                      disabled={this.props.tab.focusedTab?.length > 0 && !this.props.tab.focusedTab.includes(6 + i)}
                      style={{
                        minWidth: 0,
                        flexGrow: 1,
                        padding: 12,
                        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                        filter: this.props.tab.focusedTab?.length > 0 && !this.props.tab.focusedTab.includes(6 + i) ? 'saturate(0)' : '',
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Tabs>
          </Drawer>

          <Box
            style={{
              flexShrink: 0,
              width: '18rem',
              height: '100%',
              overflowX: 'hidden',
              overflowY: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(0, 0, 0, 0.12)',
            }}
          >
            <div
              style={{
                flexGrow: 1,
                overflowY: 'hidden',
                overflowX: 'hidden',
              }}
            >
              <Grid container justifyContent="center" alignItems="stretch" direction="row" height="100%">
                <FixedHeightTabPanel value={this.props.tab.openTab} index={0}>
                  {
                    /** predefined dataset */
                    this.props.overrideComponents?.datasetTab ? (
                      React.isValidElement(this.props.overrideComponents.datasetTab) ? (
                        this.props.overrideComponents.datasetTab
                      ) : (
                        React.createElement(this.props.overrideComponents.datasetTab as () => JSX.Element, { onDataSelected: this.onDataSelected })
                      )
                    ) : (
                      <DatasetTabPanel onDataSelected={this.onDataSelected} />
                    )
                  }
                </FixedHeightTabPanel>

                <FixedHeightTabPanel value={this.props.tab.openTab} index={1}>
                  <EmbeddingTabPanel config={this.props.features} />
                </FixedHeightTabPanel>

                <FixedHeightTabPanel value={this.props.tab.openTab} index={2}>
                  <StatesTabPanel encodings={this.props.features?.encodings} />
                </FixedHeightTabPanel>

                <FixedHeightTabPanel value={this.props.tab.openTab} index={3}>
                  {this.props.dataset != null ? <ClusteringTabPanel splitRef={this.splitRef} baseUrl={this.props.config?.baseUrl} /> : <div />}
                </FixedHeightTabPanel>

                <FixedHeightTabPanel value={this.props.tab.openTab} index={4}>
                  <DetailsTabPanel config={this.props.features} />
                </FixedHeightTabPanel>

                {this.props.overrideComponents?.detailViews?.length > 0 ? (
                  <FixedHeightTabPanel value={this.props.tab.openTab} index={5}>
                    <ViewsTabPanel overrideComponents={this.props.overrideComponents} splitRef={this.splitRef} />
                  </FixedHeightTabPanel>
                ) : null}

                {this.props.overrideComponents?.tabs?.map((tab, i) => {
                  return (
                    <FixedHeightTabPanel key={`fixed${tab.name}`} value={this.props.tab.openTab} index={6 + i}>
                      {React.isValidElement(tab.tab) ? tab.tab : React.createElement(tab.tab as () => JSX.Element, { key: `tab${tab.name}i` })}
                    </FixedHeightTabPanel>
                  );
                })}
              </Grid>
            </div>
          </Box>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
            }}
          >
            {this.props.overrideComponents?.appBar ? (
              React.isValidElement(this.props.overrideComponents?.appBar) ? (
                this.props.overrideComponents?.appBar
              ) : (
                React.createElement(this.props.overrideComponents?.appBar as () => JSX.Element)
              )
            ) : (
              <PseAppBar style={undefined}>
                <a href="https://jku-vds-lab.at" target="_blank" rel="noreferrer">
                  <img src={VDSLogo} style={{ height: 48, width: 48 }} />
                </a>
                <Typography variant="h6" style={{ marginLeft: 48, color: 'rgba(0, 0, 0, 0.54)' }}>
                  Projection Space Explorer
                </Typography>
              </PseAppBar>
            )}

            {(this.props.overrideComponents?.detailViews?.length ?? 0) > 0 ? (
              // @ts-ignore
              <Split
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
                ref={this.splitRef}
                sizes={this.props.features?.detailViewSplitRatio ?? [100, 0]}
                minSize={0}
                expandToMin={false}
                gutterSize={12}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                direction="vertical"
                cursor="ns-resize"
                onDragStart={() => {
                  this.props.setLineUpInput_visibility(false);
                }}
                onDragEnd={(sizes) => {
                  if (sizes[0] > 90) {
                    this.props.setLineUpInput_visibility(false);
                  } else {
                    this.props.setLineUpInput_visibility(true);
                  }
                }}
              >
                <div style={{ flexGrow: 0.9, display: 'flex' }}>
                  <ViewMultiplexer featureConfig={this.props.features} overrideComponents={this.props.overrideComponents} />
                </div>
                <div style={{ flexGrow: 0.1 }}>
                  <DetailViewChooser overrideComponents={this.props.overrideComponents} />
                </div>
              </Split>
            ) : (
              <div style={{ flexGrow: 1, display: 'flex' }}>
                <ViewMultiplexer featureConfig={this.props.features} overrideComponents={this.props.overrideComponents} />
              </div>
            )}
          </div>

          <StateSequenceDrawerRedux />

          <Storytelling />

          {this.props.hoverStateOrientation === HoverStateOrientation.SouthWest && (
            <div
              id="HoverItemDiv"
              style={{
                position: 'absolute',
                left: '0px',
                bottom: '0px',
                zIndex: 10000,
                padding: 8,
              }}
            />
          )}
          {this.props.hoverStateOrientation === HoverStateOrientation.NorthEast && (
            <div
              id="HoverItemDiv"
              style={{
                position: 'absolute',
                right: '0px',
                top: '0px',
                zIndex: 10000,
                padding: 8,
              }}
            />
          )}
        </div>
      );
    }
  },
);

PluginRegistry.getInstance().registerPlugin(new RubikPlugin());
PluginRegistry.getInstance().registerPlugin(new ChessPlugin());
PluginRegistry.getInstance().registerPlugin(new GoPlugin());
PluginRegistry.getInstance().registerPlugin(new CoralPlugin());
