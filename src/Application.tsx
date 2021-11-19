import "regenerator-runtime/runtime";
import { WebGLView } from './components/WebGLView/WebGLView'
import { Divider, Drawer, Paper, SvgIcon, Tooltip, Typography, Tab, Tabs, Box, Grid } from "@mui/material";
import { Dataset, ADataset, SegmentFN } from "./model/Dataset";
import { LineSelectionTree_GenAlgos, LineSelectionTree_GetChecks } from './components/DrawerTabPanels/StatesTabPanel/LineTreePopover'
import * as React from "react";
import { Storytelling } from "./components/Overlays/Storytelling";
import { ClusteringTabPanel } from "./components/DrawerTabPanels/ClusteringTabPanel/ClusteringTabPanel";
import { ConnectedProps } from 'react-redux'
import { connect } from 'react-redux'
import { StatesTabPanel } from "./components/DrawerTabPanels/StatesTabPanel/StatesTabPanel";
import { StateSequenceDrawerRedux } from "./components/Overlays/StateSequenceDrawer";
import { setProjectionOpenAction } from "./components/Ducks/ProjectionOpenDuck";
import { setDatasetAction } from "./components/Ducks/DatasetDuck";
import { setOpenTabAction } from "./components/Ducks/OpenTabDuck";
import { ClusterMode, setClusterModeAction } from "./components/Ducks/ClusterModeDuck";
import { setAdvancedColoringSelectionAction } from "./components/Ducks/AdvancedColoringSelectionDuck";
import { CategoryOptions, CategoryOptionsAPI } from "./components/WebGLView/CategoryOptions";
import { setProjectionColumns } from "./components/Ducks/ProjectionColumnsDuck";
import { EmbeddingTabPanel } from "./components/DrawerTabPanels/EmbeddingTabPanel/EmbeddingTabPanel";
import { CSVLoader } from "./components/Utility/Loaders/CSVLoader";
import { setActiveLine } from "./components/Ducks/ActiveLineDuck";
import { setPathLengthMaximum, setPathLengthRange } from "./components/Ducks/PathLengthRange";
import { setCategoryOptions } from "./components/Ducks/CategoryOptionsDuck";
import { setChannelSize } from "./components/Ducks/ChannelSize";
import { setGlobalPointSize } from "./components/Ducks/GlobalPointSizeDuck";
import { setChannelColor } from "./components/Ducks/ChannelColorDuck";
import { DatasetTabPanel } from "./components/DrawerTabPanels/DatasetTabPanel/DatasetTabPanel";
import { DetailsTabPanel } from "./components/DrawerTabPanels/DetailsTabPanel/DetailsTabPanel";
import { AProjection, IProjection, IBaseProjection } from "./model/Projection";
import { setActiveStory, setVectors, addStory } from "./components/Ducks/StoriesDuck";
import Split from 'react-split'
import { setLineByOptions } from "./components/Ducks/SelectedLineByDuck";
import { IBook } from "./model/Book";
import { setGlobalPointBrightness } from "./components/Ducks/GlobalPointBrightnessDuck";
import { setChannelBrightnessSelection } from "./components/Ducks/ChannelBrightnessDuck";
import { setGenericFingerprintAttributes } from "./components/Ducks/GenericFingerprintAttributesDuck";
import { GroupVisualizationMode, setGroupVisualizationMode } from "./components/Ducks/GroupVisualizationMode";
import { HoverStateOrientation } from "./components/Ducks/HoverStateOrientationDuck";
import { PluginRegistry } from "./components/Store/PluginScript";
import { RootState } from "./components/Store/Store";
import { RubikPlugin } from "./plugins/Rubik/RubikPlugin";
import { ChessPlugin } from "./plugins/Chess/ChessPlugin";
import { GoPlugin } from "./plugins/Go/GoPlugin";
import { PseAppBar } from "./components/PseAppBar";
import { setDetailVisibility } from "./components/Ducks/DetailViewDuck";
import { PSEIcons } from "./utils/PSEIcons";
// @ts-ignore
import VDSLogo from '../textures/vds-lab-logo-notext.svg'
import { CoralPlugin } from "./plugins/Coral/CoralPlugin";
import { DatasetEntriesAPI } from "./components/Ducks/DatasetEntriesDuck";
import { JSONLoader } from "./components";
import { DatasetType } from "./model/DatasetType";
import { addProjectionAction, updateWorkspaceAction } from "./components/Ducks/ProjectionDuck";
import { RootActions } from "./components/Store/RootActions";

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
      {<Paper style={{ overflow: 'hidden', height: '100%' }}>{children}</Paper>}
    </Typography>
  );
}



const mapStateToProps = (state: RootState) => ({
  openTab: state.openTab,
  dataset: state.dataset,
  categoryOptions: state.categoryOptions,
  channelSize: state.channelSize,
  channelColor: state.channelColor,
  channelBrightness: state.channelBrightness,
  hoverStateOrientation: state.hoverStateOrientation,
  datasetEntries: state.datasetEntries
})



const mapDispatchToProps = dispatch => ({
  addStory: story => dispatch(addStory(story)),
  setActiveStory: (activeStory: IBook) => dispatch(setActiveStory(activeStory)),
  setOpenTab: openTab => dispatch(setOpenTabAction(openTab)),
  setDataset: dataset => dispatch(setDatasetAction(dataset)),
  setAdvancedColoringSelection: value => dispatch(setAdvancedColoringSelectionAction(value)),
  setActiveLine: value => dispatch(setActiveLine(value)),
  setProjectionColumns: projectionColumns => dispatch(setProjectionColumns(projectionColumns)),
  setProjectionOpen: projectionOpen => dispatch(setProjectionOpenAction(projectionOpen)),
  setClusterMode: clusterMode => dispatch(setClusterModeAction(clusterMode)),
  setPathLengthMaximum: maximum => dispatch(setPathLengthMaximum(maximum)),
  setPathLengthRange: range => dispatch(setPathLengthRange(range)),
  setCategoryOptions: categoryOptions => dispatch(setCategoryOptions(categoryOptions)),
  setChannelSize: channelSize => dispatch(setChannelSize(channelSize)),
  setGlobalPointSize: size => dispatch(setGlobalPointSize(size)),
  wipeState: () => dispatch(RootActions.reset()),
  setChannelColor: channelColor => dispatch(setChannelColor(channelColor)),
  setChannelBrightness: channelBrightness => dispatch(setChannelBrightnessSelection(channelBrightness)),
  saveProjection: (embedding: IProjection) => dispatch(addProjectionAction(embedding)),
  updateWorkspace: (raw: IBaseProjection) => dispatch(updateWorkspaceAction(raw)),
  setVectors: vectors => dispatch(setVectors(vectors)),
  setLineByOptions: options => dispatch(setLineByOptions(options)),
  setGlobalPointBrightness: value => dispatch(setGlobalPointBrightness(value)),
  setGenericFingerprintAttributes: value => dispatch(setGenericFingerprintAttributes(value)),
  setGroupVisualizationMode: value => dispatch(setGroupVisualizationMode(value)),
  setLineUpInput_visibility: open => dispatch(setDetailVisibility(open)),
  loadDataset: (dataset: Dataset) => dispatch(RootActions.loadDataset(dataset))
})





export type BaseConfig = Partial<{
  baseUrl: string,
  preselect: Partial<{
    url: string
    initOnMount: boolean
  }>
}>

export type FeatureConfig = Partial<{
  disableEmbeddings: {
    tsne?: boolean,
    umap?: boolean,
    forceatlas?: boolean
  }
}>

export type LayerSpec = {
  order: number
  component: (props: any) => JSX.Element
}

export type ComponentConfig = Partial<{
  datasetTab: (props: {
    onDataSelected(dataset: Dataset): void;
  }) => JSX.Element
  appBar: () => JSX.Element
  detailViews: Array<DetailViewSpec>
  layers: Array<LayerSpec>
  tabs: Array<TabSpec>
}>

export type DetailViewSpec = {
  name: string
  view: () => JSX.Element
}


export type TabSpec = {
  name: string
  tab: () => JSX.Element
  icon: () => JSX.Element
  title: string
  description: string
}


/**
 * Factory method which is declared here so we can get a static type in 'ConnectedProps'
 */
const connector = connect(mapStateToProps, mapDispatchToProps);


/**
 * Type that holds the props we declared above in mapStateToProps and mapDispatchToProps
 */
type PropsFromRedux = ConnectedProps<typeof connector>



type Props = PropsFromRedux & {
  config?: BaseConfig
  features?: FeatureConfig
  overrideComponents?: ComponentConfig
}


/**
 * Main application that contains all other components.
 */
export const Application = connector(class extends React.Component<Props, any> {
  threeRef: any;
  splitRef: any;


  constructor(props) {
    super(props)

    this.threeRef = React.createRef()
    this.splitRef = React.createRef()

    this.onLineSelect = this.onLineSelect.bind(this)
    this.onDataSelected = this.onDataSelected.bind(this)
  }



  componentDidMount() {
    var url = new URL(window.location.toString());

    if ((this.props.config?.preselect?.initOnMount ?? true) && (this.props.config?.preselect?.url ?? false)) {
      var preselect = this.props.config?.preselect?.url

      var loader = preselect.endsWith('.csv') ? new CSVLoader() : new JSONLoader();

      const entry = DatasetEntriesAPI.getByPath(this.props.datasetEntries, preselect) ??
      {
        type: DatasetType.None,
        path: preselect,
        display: preselect
      }

      loader.resolvePath(entry, (dataset) => { this.onDataSelected(dataset) })
    }
  }



  /**
   * Main callback when the dataset changes
   * @param dataset 
   * @param json 
   */
  onDataSelected(dataset: Dataset) {
    //this.props.loadDataset(dataset)
    //return;

    // Wipe old state
    this.props.wipeState()

    // Dispose old view
    this.threeRef.current.disposeScene()

    this.props.setClusterMode(dataset.multivariateLabels ? ClusterMode.Multivariate : ClusterMode.Univariate)

    // if(!frontend_utils.CHEM_PROJECT)
    this.props.setGroupVisualizationMode(dataset.multivariateLabels ? GroupVisualizationMode.StarVisualization : GroupVisualizationMode.ConvexHull)

    // Set new dataset as variable
    this.props.setDataset(dataset)

    this.finite(dataset)

    this.props.setVectors(dataset.vectors)

    this.props.setLineByOptions(ADataset.getColumns(dataset))

    setTimeout(() => this.threeRef.current.requestRender(), 500)
  }


  finite(dataset: Dataset) {
    const co: CategoryOptions = {
      vectors: this.props.dataset.vectors,
      json: this.props.dataset.categories
    }

    CategoryOptionsAPI.init(co)

    this.props.setCategoryOptions(co)
    this.props.setPathLengthMaximum(SegmentFN.getMaxPathLength(dataset))
    this.props.setPathLengthRange([0, SegmentFN.getMaxPathLength(dataset)])

    this.props.saveProjection(AProjection.createProjection(dataset.vectors, "Initial Projection"))
    this.props.updateWorkspace(AProjection.createProjection(dataset.vectors, "Initial Projection").positions)

    this.props.setGenericFingerprintAttributes(ADataset.getColumns(dataset, true).map(column => ({
      feature: column,
      show: dataset.columns[column].project
    })))

    const formatRange = range => {
      try {
        return `${range.min.toFixed(2)} - ${range.max.toFixed(2)}`
      } catch {
        return 'unknown'
      }
    }

    this.props.setProjectionColumns(ADataset.getColumns(dataset, true).map(column => ({
      name: column,
      checked: dataset.columns[column].project,
      normalized: true, //TODO: after benchmarking, reverse this to true,
      range: dataset.columns[column].range ? formatRange(dataset.columns[column].range) : "unknown",
      featureLabel: dataset.columns[column].featureLabel
    })))

    this.initializeEncodings(dataset)
  }



  initializeEncodings(dataset) {
    this.threeRef.current.particles.shapeCat(null)

    var defaultSizeAttribute = CategoryOptionsAPI.getAttribute(this.props.categoryOptions, 'size', 'multiplicity', 'sequential')

    if (defaultSizeAttribute) {
      this.props.setGlobalPointSize([1, 2])
      this.props.setChannelSize(defaultSizeAttribute)

      this.threeRef.current.particles.sizeCat(defaultSizeAttribute, [1, 2])
    } else {
      this.props.setGlobalPointSize([1])
      this.props.setChannelSize(null)

      this.threeRef.current.particles.sizeCat(defaultSizeAttribute, [1])
    }



    var defaultColorAttribute = CategoryOptionsAPI.getAttribute(this.props.categoryOptions, "color", "algo", "categorical")
    if (defaultColorAttribute) {
      this.props.setChannelColor(defaultColorAttribute)
    } else {
      this.props.setChannelColor(null)
    }

    var defaultBrightnessAttribute = CategoryOptionsAPI.getAttribute(this.props.categoryOptions, "transparency", "age", "sequential")

    if (defaultBrightnessAttribute) {
      this.props.setGlobalPointBrightness([0.25, 1])
      this.props.setChannelBrightness(defaultBrightnessAttribute)
      this.threeRef.current.particles.transparencyCat(defaultBrightnessAttribute, [0.25, 1])
    } else {
      this.props.setGlobalPointBrightness([1])
      this.props.setChannelBrightness(null)
      this.threeRef.current.particles.transparencyCat(defaultBrightnessAttribute, [1])
    }
  }

  onLineSelect(algo, show) {
    this.threeRef.current.filterLines(algo, show)
    this.threeRef.current.requestRender()
  }

  onChangeTab(newTab) {
    if (newTab === this.props.openTab) {
      this.props.setOpenTab(false)
    } else {
      this.props.setOpenTab(newTab)
    }
  }



  render() {
    return <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden'
      }}>

      <Drawer
        variant="permanent"
        style={{
          width: 88
        }}
        PaperProps={{ style: { position: 'relative', overflow: 'hidden', border: 'none' } }}
      >
        <Divider />
        <Tabs
          style={{
            width: 88
          }}
          value={this.props.openTab}
          orientation="vertical"
          indicatorColor="primary"
          textColor="primary"

          onChange={(e, newTab) => this.onChangeTab(newTab)}
          aria-label="disabled tabs example"
        >
          <Tooltip placement="right" title={<React.Fragment>
            <Typography variant="subtitle2">Load Dataset</Typography>
            <Typography variant="body2">Upload a new dataset or choose a predefined one.</Typography>
          </React.Fragment>}><Tab value={0} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PSEIcons.Dataset}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, padding: 12, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} /></Tooltip>

          <Tooltip placement="right" title={<React.Fragment>
            <Typography variant="subtitle2">Embedding and Projection</Typography>
            <Typography variant="body2">Perform projection techniques like t-SNE, UMAP, or a force-directly layout with your data.</Typography>
          </React.Fragment>}><Tab value={1} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PSEIcons.Project}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, padding: 12, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} /></Tooltip>

          <Tooltip placement="right" title={<React.Fragment>
            <Typography variant="subtitle2">Point and Line Channels</Typography>
            <Typography variant="body2">Contains settings that let you map different channels like brightness and color on point and line attributes.</Typography>
          </React.Fragment>}><Tab value={2} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PSEIcons.Encoding}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, padding: 12, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} /></Tooltip>

          <Tooltip placement="right" title={<React.Fragment>
            <Typography variant="subtitle2">Groups</Typography>
            <Typography variant="body2">Contains options for displaying and navigating groups in the dataset.</Typography>
          </React.Fragment>}><Tab value={3} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PSEIcons.Clusters}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, padding: 12, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} /></Tooltip>

          <Tooltip placement="right" title={<React.Fragment>
            <Typography variant="subtitle2">Hover Item and Selection Summary</Typography>
            <Typography variant="body2">Contains information about the currently hovered item and the currently selected summary.</Typography>
          </React.Fragment>}><Tab value={4} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PSEIcons.Details}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, padding: 12, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} /></Tooltip>

          {this.props.overrideComponents?.tabs?.map((tab, i) => {
            return <Tooltip key={`tooltip${tab.name}`} placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">{tab.title}</Typography>
              <Typography variant="body2">{tab.description}</Typography>
            </React.Fragment>}><Tab value={5 + i} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={tab.icon}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, paddingTop: 16, paddingBottom: 16 }} /></Tooltip>
          })}

        </Tabs>
      </Drawer>

      <Box
        style={{
          flexShrink: 0,
          width: this.props.openTab === false ? '0rem' : "18rem",
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(0, 0, 0, 0.12)'
        }}>
        <div style={{
          flexGrow: 1,
          overflowY: 'hidden',
          overflowX: 'hidden'
        }}>


          <Grid
            container
            justifyContent="center"
            alignItems="stretch"
            direction="row"
            height='100%'
          >



            <FixedHeightTabPanel value={this.props.openTab} index={0} >
              {
                /** predefined dataset */
                this.props.overrideComponents?.datasetTab ? React.createElement(this.props.overrideComponents?.datasetTab, { onDataSelected: this.onDataSelected }) : <DatasetTabPanel onDataSelected={this.onDataSelected}></DatasetTabPanel>
              }
            </FixedHeightTabPanel>


            <FixedHeightTabPanel value={this.props.openTab} index={1}>
              <EmbeddingTabPanel
                config={this.props.features}
                webGLView={this.threeRef}></EmbeddingTabPanel>
            </FixedHeightTabPanel>

            <FixedHeightTabPanel value={this.props.openTab} index={2}>
              <StatesTabPanel
                webGlView={this.threeRef}
              ></StatesTabPanel>
            </FixedHeightTabPanel>


            <FixedHeightTabPanel value={this.props.openTab} index={3}>
              {this.props.dataset != null ?
                <ClusteringTabPanel
                  splitRef={this.splitRef}
                ></ClusteringTabPanel> : <div></div>
              }
            </FixedHeightTabPanel>


            <FixedHeightTabPanel value={this.props.openTab} index={4}>
              <DetailsTabPanel></DetailsTabPanel>
            </FixedHeightTabPanel>


            {this.props.overrideComponents?.tabs?.map((tab, i) => {
              return <FixedHeightTabPanel key={`fixed${tab.name}`} value={this.props.openTab} index={5 + i}>
                {React.createElement(tab.tab, { splitRef: this.splitRef })}
              </FixedHeightTabPanel>
            })}

          </Grid>
        </div>
      </Box>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>

        {this.props.overrideComponents?.appBar ? React.createElement(this.props.overrideComponents?.appBar) :
          <PseAppBar>
            <a href={"https://jku-vds-lab.at"} target={"_blank"}><VDSLogo style={{ height: 48, width: 48 }}></VDSLogo></a>
            <Typography variant="h6" style={{ marginLeft: 48, color: "rgba(0, 0, 0, 0.54)" }}>
              {"Projection Space Explorer"}
            </Typography>
          </PseAppBar>
        }


        {
          (this.props.overrideComponents?.detailViews?.length ?? 0) > 0 ?
            //@ts-ignore
            <Split
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              ref={this.splitRef}
              sizes={[100, 0]}
              minSize={0}
              expandToMin={false}
              gutterSize={12}
              gutterAlign="center"
              snapOffset={30}
              dragInterval={1}
              direction="vertical"
              cursor="ns-resize"
              onDragStart={() => {
                this.props.setLineUpInput_visibility(false)
              }}
              onDragEnd={(sizes) => {
                if (sizes[0] > 90) {
                  this.props.setLineUpInput_visibility(false)
                } else {
                  this.props.setLineUpInput_visibility(true)
                }
              }}
            >
              <div style={{ flexGrow: 0.9 }}>
                <WebGLView
                  ref={this.threeRef}
                  overrideComponents={this.props.overrideComponents}
                />
              </div>
              <div style={{ flexGrow: 0.1 }}>
                {
                  React.createElement(this.props.overrideComponents.detailViews[0].view, {})
                }
              </div>
            </Split> : <div style={{ flexGrow: 1 }}>
              <WebGLView
                overrideComponents={this.props.overrideComponents}
                ref={this.threeRef}
              />
            </div>
        }
      </div>

      <StateSequenceDrawerRedux></StateSequenceDrawerRedux>

      <Storytelling></Storytelling>

      {this.props.hoverStateOrientation == HoverStateOrientation.SouthWest && <div id="HoverItemDiv" style={{
        position: 'absolute',
        left: '0px',
        bottom: '0px',
        zIndex: 10000,
        padding: 8
      }}></div>}
      {this.props.hoverStateOrientation == HoverStateOrientation.NorthEast && <div id="HoverItemDiv" style={{
        position: 'absolute',
        right: '0px',
        top: '0px',
        zIndex: 10000,
        padding: 8
      }}></div>}
    </div>
  }
})









const onClick = async (content: string) => {
  // @ts-ignore
  const handle = await window.showSaveFilePicker({
    suggestedName: 'session.pse',
    types: [{
      description: 'PSE Session',
      accept: {
        'text/plain': ['.pse'],
      },
    }],
  });

  const writable = await handle.createWritable()
  writable.write(content)
  await writable.close()

  return handle;
}


const loo = async () => {
  // @ts-ignore
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();

  return contents
}








PluginRegistry.getInstance().registerPlugin(new RubikPlugin())
PluginRegistry.getInstance().registerPlugin(new ChessPlugin())
PluginRegistry.getInstance().registerPlugin(new GoPlugin())
PluginRegistry.getInstance().registerPlugin(new CoralPlugin())