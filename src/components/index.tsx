import "regenerator-runtime/runtime";

import Typography from '@material-ui/core/Typography';
import { WebGLView } from './WebGLView/WebGLView'
import Grid from '@material-ui/core/Grid';
import { NamedCategoricalScales } from "./Utility/Colors/NamedCategoricalScales";
import { ContinuousMapping } from "./Utility/Colors/ContinuousMapping";
import { DiscreteMapping } from "./Utility/Colors/DiscreteMapping";
import { ContinuosScale, DiscreteScale } from "./Utility/Colors/ContinuosScale";
import { AppBar, createMuiTheme, Divider, Drawer, MuiThemeProvider, Paper, SvgIcon, Toolbar, Tooltip } from "@material-ui/core";
import { DatasetDatabase } from "./Utility/Data/DatasetDatabase";
import { Dataset } from "./Utility/Data/Dataset";
import { LineTreePopover, LineSelectionTree_GenAlgos, LineSelectionTree_GetChecks } from './DrawerTabPanels/StatesTabPanel/LineTreePopover/LineTreePopover'
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import * as React from "react";
import { PathLengthFilter } from "./DrawerTabPanels/StatesTabPanel/PathLengthFilter/PathLengthFilter";
import { Storytelling } from "./Overlays/ClusterOverview/Storytelling";
import { Legend } from "./DrawerTabPanels/StatesTabPanel/LineSelection/LineSelection";
import * as ReactDOM from 'react-dom';
import { ClusteringTabPanel } from "./DrawerTabPanels/ClusteringTabPanel/ClusteringTabPanel";
import { createStore } from 'redux'
import { ConnectedProps, Provider } from 'react-redux'
import { connect } from 'react-redux'
import { StatesTabPanel } from "./DrawerTabPanels/StatesTabPanel/StatesTabPanel";
import { StateSequenceDrawerRedux } from "./Overlays/StateSequenceDrawer/StateSequenceDrawer";
import { setProjectionOpenAction } from "./Ducks/ProjectionOpenDuck";
import { setDatasetAction } from "./Ducks/DatasetDuck";
import { setOpenTabAction } from "./Ducks/OpenTabDuck";
import { setWebGLView } from "./Ducks/WebGLViewDuck";
import { ClusterMode, setClusterModeAction } from "./Ducks/ClusterModeDuck";
import { setAdvancedColoringSelectionAction } from "./Ducks/AdvancedColoringSelectionDuck";
import { CategoryOptions } from "./WebGLView/CategoryOptions";
import { setProjectionColumns } from "./Ducks/ProjectionColumnsDuck";
import { EmbeddingTabPanel } from "./DrawerTabPanels/EmbeddingTabPanel/EmbeddingTabPanel";
import { CSVLoader } from "./Utility/Loaders/CSVLoader";
import { StoryEditor } from "./Overlays/StoryEditor/StoryEditor";
import { PathBrightnessSlider } from "./DrawerTabPanels/StatesTabPanel/PathTransparencySlider/PathBrightnessSlider";
import { setActiveLine } from "./Ducks/ActiveLineDuck";
import { setPathLengthMaximum, setPathLengthRange } from "./Ducks/PathLengthRange";
import { setCategoryOptions } from "./Ducks/CategoryOptionsDuck";
import { setChannelSize } from "./Ducks/ChannelSize";
import { setGlobalPointSize } from "./Ducks/GlobalPointSizeDuck";
import { setChannelColor } from "./Ducks/ChannelColorDuck";
import { rootReducer, RootState } from "./Store/Store";
import { DatasetTabPanel } from "./DrawerTabPanels/DatasetTabPanel/DatasetTabPanel";
import { LineUpContext } from "./LineUpContext/LineUpContext";
import { devToolsEnhancer } from 'redux-devtools-extension';
import { setLineUpInput_visibility } from './Ducks/LineUpInputDuck';
import { SDFLoader } from "./Utility/Loaders/SDFLoader";
import * as frontend_utils from "../utils/frontend-connect";
import { DetailsTabPanel } from "./DrawerTabPanels/DetailsTabPanel/DetailsTabPanel";
import { addProjectionAction } from "./Ducks/ProjectionsDuck";
import { Embedding } from "./Utility/Data/Embedding";
import { setActiveStory, setVectors, addStory } from "./Ducks/StoriesDuck";
// @ts-ignore
import PseDataset from './Icons/pse-icon-dataset.svg'
// @ts-ignore
import PseClusters from './Icons/pse-icon-clusters.svg'
// @ts-ignore
import PseDetails from './Icons/pse-icon-details.svg'
// @ts-ignore
import PseEncoding from './Icons/pse-icon-encoding.svg'
// @ts-ignore
import PseProject from './Icons/pse-icon-project.svg'
// @ts-ignore
import PseLineup from './Icons/pse-icon-lineup.svg'
import './index.scss'
import Split from 'react-split'
import { setLineByOptions } from "./Ducks/SelectedLineByDuck";
import { LineUpTabPanel } from "./DrawerTabPanels/LineUpTabPanel/LineUpTabPanel";
import { setSplitRef } from "./Ducks/SplitRefDuck";
import { Story } from "./Utility/Data/Story";
import { BrightnessSlider } from "./DrawerTabPanels/StatesTabPanel/BrightnessSlider/BrightnessSlider";
import { setGlobalPointBrightness } from "./Ducks/GlobalPointBrightnessDuck";
import { setChannelBrightnessSelection } from "./Ducks/ChannelBrightnessDuck";
import { setGenericFingerprintAttributes } from "./Ducks/GenericFingerprintAttributesDuck";
import { GroupVisualizationMode, setGroupVisualizationMode } from "./Ducks/GroupVisualizationMode";
import { HoverStateOrientation } from "./Ducks/HoverStateOrientationDuck";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';


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
    >
      {<Paper style={{ overflow: 'hidden', height: '100vh' }}>{children}</Paper>}
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
  splitRef: state.splitRef,
  hoverStateOrientation: state.hoverStateOrientation
})


const mapDispatchToProps = dispatch => ({
  addStory: story => dispatch(addStory(story)),
  setActiveStory: (activeStory: Story) => dispatch(setActiveStory(activeStory)),
  setOpenTab: openTab => dispatch(setOpenTabAction(openTab)),
  setDataset: dataset => dispatch(setDatasetAction(dataset)),
  setAdvancedColoringSelection: value => dispatch(setAdvancedColoringSelectionAction(value)),
  setActiveLine: value => dispatch(setActiveLine(value)),
  setProjectionColumns: projectionColumns => dispatch(setProjectionColumns(projectionColumns)),
  setProjectionOpen: projectionOpen => dispatch(setProjectionOpenAction(projectionOpen)),
  setWebGLView: webGLView => dispatch(setWebGLView(webGLView)),
  setClusterMode: clusterMode => dispatch(setClusterModeAction(clusterMode)),
  setPathLengthMaximum: maximum => dispatch(setPathLengthMaximum(maximum)),
  setPathLengthRange: range => dispatch(setPathLengthRange(range)),
  setCategoryOptions: categoryOptions => dispatch(setCategoryOptions(categoryOptions)),
  setChannelSize: channelSize => dispatch(setChannelSize(channelSize)),
  setGlobalPointSize: size => dispatch(setGlobalPointSize(size)),
  wipeState: () => dispatch({ type: 'RESET_APP' }),
  setChannelColor: channelColor => dispatch(setChannelColor(channelColor)),
  // setLineUpInput_data: input => dispatch(setLineUpInput_data(input)),
  // setLineUpInput_columns: input => dispatch(setLineUpInput_columns(input)),
  setChannelBrightness: channelBrightness => dispatch(setChannelBrightnessSelection(channelBrightness)),
  setLineUpInput_visibility: input => dispatch(setLineUpInput_visibility(input)),
  saveProjection: embedding => dispatch(addProjectionAction(embedding)),
  setVectors: vectors => dispatch(setVectors(vectors)),
  setLineByOptions: options => dispatch(setLineByOptions(options)),
  setSplitRef: splitRef => dispatch(setSplitRef(splitRef)),
  setGlobalPointBrightness: value => dispatch(setGlobalPointBrightness(value)),
  setGenericFingerprintAttriutes: value => dispatch(setGenericFingerprintAttributes(value)),
  setGroupVisualizationMode: value => dispatch(setGroupVisualizationMode(value))
})








/**
 * Factory method which is declared here so we can get a static type in 'ConnectedProps'
 */
const connector = connect(mapStateToProps, mapDispatchToProps);


/**
 * Type that holds the props we declared above in mapStateToProps and mapDispatchToProps
 */
type PropsFromRedux = ConnectedProps<typeof connector>

/**
 * Type that holds every property that is relevant to our component, that is the props declared above + our OWN component props
 */
// type Props = PropsFromRedux & {
//     onFilter: any
//     // My own property 1
//     // My own property 2
// }

type Props = PropsFromRedux & {
}





/**
 * Main application that contains all other components.
 */
var Application = connector(class extends React.Component<Props, any> {
  legend: React.RefObject<Legend>;
  dataset: Dataset;
  threeRef: any;
  splitRef: any;


  constructor(props) {
    super(props)

    this.state = {
      fileDialogOpen: true
    }


    this.threeRef = React.createRef()
    this.splitRef = React.createRef()
    this.props.setWebGLView(this.threeRef)

    this.legend = React.createRef()
    this.onLineSelect = this.onLineSelect.bind(this)
    this.onDataSelected = this.onDataSelected.bind(this)
  }


  componentDidMount() {
    const mangleURL = (url: string) => {
      if (url.endsWith('csv') || url.endsWith('json') || url.endsWith('sdf')) {
        return `datasets/${url}`
      }

      return `datasets/${url}.csv`
    }

    var url = new URL(window.location.toString());
    var set = url.searchParams.get("set");
    var preselect = frontend_utils.CHEM_PROJECT ? "test.sdf" : "datasets/rubik/cube10x2_different_origins.csv"
    var loader = frontend_utils.CHEM_PROJECT ? new SDFLoader() : new CSVLoader();

    if (set != null) {
      if (set == "neural") {
        preselect = "datasets/neural/learning_confmat.csv"
        loader = new CSVLoader();
      } else if (set == "rubik") {
        preselect = "datasets/rubik/cube10x2_different_origins.csv"
        loader = new CSVLoader();
      } else if (set == "chess") {
        preselect = "datasets/chess/chess16k.csv"
        loader = new CSVLoader();
      } else if (set == "cime") {
        preselect = "test.sdf";
        loader = new SDFLoader();
      } else {
        preselect = mangleURL(set)
      }
      loader.resolvePath(new DatasetDatabase().getByPath(preselect), (dataset, json) => { this.onDataSelected(dataset, json) })
    } else {
      loader.resolvePath(new DatasetDatabase().getByPath(preselect), (dataset, json) => { this.onDataSelected(dataset, json) })
    }
  }



  convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }



  /**
   * Main callback when the dataset changes
   * @param dataset 
   * @param json 
   */
  onDataSelected(dataset: Dataset, json) {
    // Wipe old state
    this.props.wipeState()

    // Dispose old view
    this.threeRef.current.disposeScene()

    this.props.setClusterMode(dataset.multivariateLabels ? ClusterMode.Multivariate : ClusterMode.Univariate)

    // if(!frontend_utils.CHEM_PROJECT)
    this.props.setGroupVisualizationMode(dataset.multivariateLabels ? GroupVisualizationMode.StarVisualization : GroupVisualizationMode.ConvexHull)

    // Set new dataset as variable
    this.props.setDataset(dataset)

    // Load new view
    let lineScheme = this.mappingFromScale(NamedCategoricalScales.DARK2(), { key: 'algo' }, dataset)

    this.setState({
      lineColorScheme: lineScheme
    })



    this.threeRef.current.createVisualization(dataset, lineScheme, null)

    this.finite(lineScheme, json, dataset)

    this.props.setVectors(dataset.vectors)

    // this.props.setLineUpInput_columns(dataset.columns);
    // this.props.setLineUpInput_data(dataset.vectors);
    this.props.setSplitRef(this.splitRef)

    this.props.setLineByOptions(dataset.getColumns())

    setTimeout(() => this.threeRef.current.requestRender(), 500)


    // set default storybook that contains all clusters and no arrows
    if (dataset.clusters.length > 0) {
      let story = new Story(dataset.clusters, []);
      this.props.addStory(story)
      this.props.setActiveStory(null)
      // this.props.setActiveStory(story) // TODO: should we set the new story active?
    }
  }


  finite(lineColorScheme, categories, dataset: Dataset) {
    var algos = LineSelectionTree_GenAlgos(this.props.dataset.vectors)
    var selLines = LineSelectionTree_GetChecks(algos)

    // Update shape legend
    this.setState({
      selectedLines: selLines,
      selectedLineAlgos: algos
    })

    this.props.setCategoryOptions(new CategoryOptions(this.props.dataset.vectors, categories))
    this.props.setPathLengthMaximum(dataset.getMaxPathLength())
    this.props.setPathLengthRange([0, dataset.getMaxPathLength()])
    this.props.saveProjection(new Embedding(dataset.vectors, "Initial Projection"))
    this.props.setGenericFingerprintAttriutes(dataset.getColumns(true).map(column => ({
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

    this.props.setProjectionColumns(dataset.getColumns(true).map(column => ({
      name: column,
      checked: dataset.columns[column].project,
      normalized: true,
      range: dataset.columns[column].range ? formatRange(dataset.columns[column].range) : "unknown",
      featureLabel: dataset.columns[column].featureLabel
    })))

    this.legend.current?.load(dataset.info.type, lineColorScheme, this.state.selectedLineAlgos)

    this.initializeEncodings(dataset)
  }

  mappingFromScale(scale, attribute, dataset) {
    if (scale instanceof DiscreteScale) {
      // Generate scale
      return new DiscreteMapping(scale, [... new Set(this.props.dataset.vectors.map(vector => vector[attribute.key]))])
    }
    if (scale instanceof ContinuosScale) {
      var min = null, max = null
      if (dataset.columns[attribute.key].range) {
        min = dataset.columns[attribute.key].range.min
        max = dataset.columns[attribute.key].range.max
      } else {
        var filtered = this.props.dataset.vectors.map(vector => vector[attribute.key])
        max = Math.max(...filtered)
        min = Math.min(...filtered)
      }

      return new ContinuousMapping(scale, { min: min, max: max })
    }
    return null
  }

  initializeEncodings(dataset) {
    var state = {} as any

    this.threeRef.current.particles.shapeCat(null)

    var defaultSizeAttribute = this.props.categoryOptions.getAttribute('size', 'multiplicity', 'sequential')

    if (defaultSizeAttribute) {
      this.props.setGlobalPointSize([1, 2])
      this.props.setChannelSize(defaultSizeAttribute)

      this.threeRef.current.particles.sizeCat(defaultSizeAttribute, [1, 2])
    } else {
      this.props.setGlobalPointSize([1])
      this.props.setChannelSize(null)

      this.threeRef.current.particles.sizeCat(defaultSizeAttribute, [1])
    }



    var defaultColorAttribute = this.props.categoryOptions.getAttribute("color", "algo", "categorical")
    if (defaultColorAttribute) {
      this.props.setChannelColor(defaultColorAttribute)
    } else {
      this.props.setChannelColor(null)
    }

    var defaultBrightnessAttribute = this.props.categoryOptions.getAttribute("transparency", "age", "sequential")

    if (defaultBrightnessAttribute) {
      this.props.setGlobalPointBrightness([0.25, 1])
      this.props.setChannelBrightness(defaultBrightnessAttribute)
      this.threeRef.current.particles.transparencyCat(defaultBrightnessAttribute, [0.25, 1])
    } else {
      this.props.setGlobalPointBrightness([1])
      this.props.setChannelBrightness(null)
      this.threeRef.current.particles.transparencyCat(defaultBrightnessAttribute, [1])
    }

    this.setState(state)
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
    return <div>

      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          width: "100vw",
          height: "100vh"
        }}>

        <Drawer
          variant="permanent"
          style={{
            width: 88
          }}
        >
          <Divider />
          <Tabs
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
            </React.Fragment>}><Tab value={0} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseDataset}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, paddingTop: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} /></Tooltip>

            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Embedding and Projection</Typography>
              <Typography variant="body2">Perform projection techniques like t-SNE, UMAP, or a force-directly layout with your data.</Typography>
            </React.Fragment>}><Tab className="pse-tab" value={1} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseProject}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, paddingTop: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} /></Tooltip>

            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Point and Line Channels</Typography>
              <Typography variant="body2">Contains settings that let you map different channels like brightness and color on point and line attributes.</Typography>
            </React.Fragment>}><Tab className="pse-tab" value={2} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseEncoding}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, paddingTop: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} /></Tooltip>

            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Clustering</Typography>
              <Typography variant="body2">Contains options for displaying and navigating clusters in the dataset.</Typography>
            </React.Fragment>}><Tab className="pse-tab" value={3} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseClusters}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, paddingTop: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} /></Tooltip>

            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Hover Item and Selection Summary</Typography>
              <Typography variant="body2">Contains information about the currently hovered item and the currently selected summary.</Typography>
            </React.Fragment>}><Tab className="pse-tab" value={4} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseDetails}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, paddingTop: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} /></Tooltip>

            {/* {frontend_utils.CHEM_PROJECT && <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Backend Settings</Typography>
              <Typography variant="body2">Adjust Settings used in the backend.</Typography>
            </React.Fragment>}><Tab icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseDetails}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>
            } */}
            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">LineUp Integration</Typography>
              <Typography variant="body2">Settings for LineUp Integration</Typography>
            </React.Fragment>}><Tab className="pse-tab" value={5} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseLineup}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, paddingTop: 16, paddingBottom: 16 }} /></Tooltip>
          </Tabs>
        </Drawer>

        <Box
          style={{
            flexShrink: 0,
            width: this.props.openTab === false ? '0rem' : "18rem",
            height: '100vh',
            overflowX: 'hidden',
            overflowY: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(0, 0, 0, 0.12)'
          }}>
          <div style={{
            flexGrow: 1,
            overflowY: 'hidden'
          }}>


            <Grid
              container
              justify="center"
              alignItems="stretch"
              direction="column">



              <FixedHeightTabPanel value={this.props.openTab} index={0} >
                <DatasetTabPanel onDataSelected={this.onDataSelected}></DatasetTabPanel>
              </FixedHeightTabPanel>


              <FixedHeightTabPanel value={this.props.openTab} index={1}>
                <EmbeddingTabPanel></EmbeddingTabPanel>
              </FixedHeightTabPanel>

              <FixedHeightTabPanel value={this.props.openTab} index={2}>
                <StatesTabPanel lineColorScheme={this.state.lineColorScheme}></StatesTabPanel>
              </FixedHeightTabPanel>


              <FixedHeightTabPanel value={this.props.openTab} index={3}>

                {this.props.dataset != null ?
                  <ClusteringTabPanel
                    open={this.props.openTab == 2}
                    clusteringWorker={this.state.clusteringWorker}
                  ></ClusteringTabPanel> : <div></div>
                }
              </FixedHeightTabPanel>


              <FixedHeightTabPanel value={this.props.openTab} index={4}>
                <DetailsTabPanel hoverUpdate={(hover_item, updater) => { this.threeRef.current.hoverUpdate(hover_item, updater) }}></DetailsTabPanel>
              </FixedHeightTabPanel>

              {/* {frontend_utils.CHEM_PROJECT && 
              <FixedHeightTabPanel value={this.props.openTab} index={5}>
                <ChemTabPanel></ChemTabPanel>
              </FixedHeightTabPanel>} */}

              <FixedHeightTabPanel value={this.props.openTab} index={5}>
                <LineUpTabPanel></LineUpTabPanel>
              </FixedHeightTabPanel>
            </Grid>

          </div>

        </Box>


        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          flexGrow: 1
        }}>
          <AppBar variant="outlined" position="relative" color="transparent">
            <Toolbar>
              <a href={"https://jku-vds-lab.at"} target={"_blank"}><img style={{ height: 48 }} src={"textures/vds-lab-logo-notext.svg"} /></a>
              {frontend_utils.CHEM_PROJECT && <a href={"https://www.bayer.com"} target={"_blank"}><img style={{ height: 48, marginLeft: 48 }} src={"textures/bayer-logo.svg"} alt="Powered By Bayer" /></a>}
              <Typography variant="h6" style={{ marginLeft: 48, color: "rgba(0, 0, 0, 0.54)" }}>
                {frontend_utils.CHEM_PROJECT ? "CIME: Chem-Informatics Model Explorer" : "Projection Space Explorer"}
              </Typography>
            </Toolbar>
          </AppBar>

          <Split
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            ref={this.splitRef}
            sizes={[100, 0]}
            minSize={0}
            expandToMin={false}
            gutterSize={10}
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
              />
            </div>
            <div style={{ flexGrow: 0.1 }}>
              {/* TODO: lineupFilter is not used anymore... */}
              <LineUpContext onFilter={() => { this.threeRef.current.lineupFilterUpdate() }} hoverUpdate={(hover_item, updater) => { this.threeRef.current.hoverUpdate(hover_item, updater) }}></LineUpContext>
            </div>
          </Split>



        </div>


        
        <StateSequenceDrawerRedux></StateSequenceDrawerRedux>

        <Storytelling></Storytelling>



        <StoryEditor></StoryEditor>



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
    </div>
  }
})













const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#007dad',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    }
  }
})

// Render the application into our 'mountingPoint' div that is declared in 'index.html'.
ReactDOM.render(
  <Provider store={createStore(rootReducer, devToolsEnhancer({}))}>
    <MuiThemeProvider theme={theme}>
      <Application />
    </MuiThemeProvider>

  </Provider>, document.getElementById("mountingPoint"))