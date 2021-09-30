import "regenerator-runtime/runtime";

import Typography from '@material-ui/core/Typography';
import { WebGLView } from './WebGLView/WebGLView'
import Grid from '@material-ui/core/Grid';
import { AppBar, Button, Divider, Drawer, Paper, SvgIcon, Toolbar, Tooltip } from "@material-ui/core";
import { DatasetDatabase } from "./Utility/Data/DatasetDatabase";
import { Dataset, DatasetUtil, SegmentFN } from "../model/Dataset";
import { LineSelectionTree_GenAlgos, LineSelectionTree_GetChecks } from './DrawerTabPanels/StatesTabPanel/LineTreePopover/LineTreePopover'
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import * as React from "react";
import { Storytelling } from "./Overlays/ClusterOverview/Storytelling";
import * as ReactDOM from 'react-dom';
import { ClusteringTabPanel } from "./DrawerTabPanels/ClusteringTabPanel/ClusteringTabPanel";
import { ConnectedProps } from 'react-redux'
import { connect } from 'react-redux'
import { StatesTabPanel } from "./DrawerTabPanels/StatesTabPanel/StatesTabPanel";
import { StateSequenceDrawerRedux } from "./Overlays/StateSequenceDrawer/StateSequenceDrawer";
import { setProjectionOpenAction } from "./Ducks/ProjectionOpenDuck";
import { setDatasetAction } from "./Ducks/DatasetDuck";
import { setOpenTabAction } from "./Ducks/OpenTabDuck";
import { ClusterMode, setClusterModeAction } from "./Ducks/ClusterModeDuck";
import { setAdvancedColoringSelectionAction } from "./Ducks/AdvancedColoringSelectionDuck";
import { CategoryOptions, CategoryOptionsAPI } from "./WebGLView/CategoryOptions";
import { setProjectionColumns } from "./Ducks/ProjectionColumnsDuck";
import { EmbeddingTabPanel } from "./DrawerTabPanels/EmbeddingTabPanel/EmbeddingTabPanel";
import { CSVLoader } from "./Utility/Loaders/CSVLoader";
import { setActiveLine } from "./Ducks/ActiveLineDuck";
import { setPathLengthMaximum, setPathLengthRange } from "./Ducks/PathLengthRange";
import { setCategoryOptions } from "./Ducks/CategoryOptionsDuck";
import { setChannelSize } from "./Ducks/ChannelSize";
import { setGlobalPointSize } from "./Ducks/GlobalPointSizeDuck";
import { setChannelColor } from "./Ducks/ChannelColorDuck";
import { DatasetTabPanel } from "./DrawerTabPanels/DatasetTabPanel/DatasetTabPanel";
import { LineUpContext } from "./LineUpContext/LineUpContext";
import { setLineUpInput_visibility } from './Ducks/LineUpInputDuck';
import { SDFLoader } from "./Utility/Loaders/SDFLoader";
import * as frontend_utils from "../utils/frontend-connect";
import { DetailsTabPanel } from "./DrawerTabPanels/DetailsTabPanel/DetailsTabPanel";
import { addProjectionAction } from "./Ducks/ProjectionsDuck";
import { Embedding } from "../model/Embedding";
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
import Split from 'react-split'
import { setLineByOptions } from "./Ducks/SelectedLineByDuck";
import { LineUpTabPanel } from "./DrawerTabPanels/LineUpTabPanel/LineUpTabPanel";
import { IBook } from "../model/Book";
import { setGlobalPointBrightness } from "./Ducks/GlobalPointBrightnessDuck";
import { setChannelBrightnessSelection } from "./Ducks/ChannelBrightnessDuck";
import { setGenericFingerprintAttributes } from "./Ducks/GenericFingerprintAttributesDuck";
import { GroupVisualizationMode, setGroupVisualizationMode } from "./Ducks/GroupVisualizationMode";
import { HoverStateOrientation } from "./Ducks/HoverStateOrientationDuck";
import { PSEContextProvider } from "./Store/PSEContext";
import { API } from "./Store/PluginScript";
import { RootState } from "./Store/Store";
import { DatasetType } from "../model/DatasetType";


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
  hoverStateOrientation: state.hoverStateOrientation
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
  wipeState: () => dispatch({ type: 'RESET_APP' }),
  setChannelColor: channelColor => dispatch(setChannelColor(channelColor)),
  setChannelBrightness: channelBrightness => dispatch(setChannelBrightnessSelection(channelBrightness)),
  setLineUpInput_visibility: input => dispatch(setLineUpInput_visibility(input)),
  saveProjection: embedding => dispatch(addProjectionAction(embedding)),
  setVectors: vectors => dispatch(setVectors(vectors)),
  setLineByOptions: options => dispatch(setLineByOptions(options)),
  setGlobalPointBrightness: value => dispatch(setGlobalPointBrightness(value)),
  setGenericFingerprintAttributes: value => dispatch(setGenericFingerprintAttributes(value)),
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

export interface ApplicationConfig {
  
}

type Props = PropsFromRedux & {
  config: ApplicationConfig
}





/**
 * Main application that contains all other components.
 */
var Application = connector(class extends React.Component<Props, any> {
  dataset: Dataset;
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
    const mangleURL = (url: string) => {
      if (url.endsWith('csv') || url.endsWith('json')) {
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
      } else if (set == "reaction") {
        preselect = "datasets/chemvis/domain_5000_all_predictions.csv";
        loader = new CSVLoader();
      } else {
        if(set.endsWith("sdf")){
          loader.resolvePath({
            display: set,
            path: set,
            type: DatasetType.Chem,
            uploaded: true
          }, (dataset) => { this.onDataSelected(dataset) })
          return;
        }
        preselect = mangleURL(set);
      }
      loader.resolvePath(new DatasetDatabase().getByPath(preselect), (dataset) => { this.onDataSelected(dataset) })
    } else {
      loader.resolvePath(new DatasetDatabase().getByPath(preselect), (dataset) => { this.onDataSelected(dataset) })
    }
  }


  /**
   * Main callback when the dataset changes
   * @param dataset 
   * @param json 
   */
  onDataSelected(dataset: Dataset) {
    // Wipe old state
    this.props.wipeState()

    // Dispose old view
    this.threeRef.current.disposeScene()

    this.props.setClusterMode(dataset.multivariateLabels ? ClusterMode.Multivariate : ClusterMode.Univariate)

    // if(!frontend_utils.CHEM_PROJECT)
    this.props.setGroupVisualizationMode(dataset.multivariateLabels ? GroupVisualizationMode.StarVisualization : GroupVisualizationMode.ConvexHull)

    // Set new dataset as variable
    this.props.setDataset(dataset)



    //this.threeRef.current.createVisualization(dataset, lineScheme, null)

    this.finite(dataset)

    this.props.setVectors(dataset.vectors)

    // this.props.setLineUpInput_columns(dataset.columns);
    // this.props.setLineUpInput_data(dataset.vectors);


    this.props.setLineByOptions(DatasetUtil.getColumns(dataset))

    setTimeout(() => this.threeRef.current.requestRender(), 500)


    // set default storybook that contains all clusters and no arrows
    if (dataset.clusters.length > 0) {
      //let story = new Storybook(dataset.clusters, []);
      //this.props.addStory(story)
      //this.props.setActiveStory(null)
      // this.props.setActiveStory(story) // TODO: should we set the new story active?
    }

  }


  finite(dataset: Dataset) {
    var algos = LineSelectionTree_GenAlgos(this.props.dataset.vectors)
    var selLines = LineSelectionTree_GetChecks(algos)

    // Update shape legend
    this.setState({
      selectedLines: selLines,
      selectedLineAlgos: algos
    })
    const co = new CategoryOptions(this.props.dataset.vectors, this.props.dataset.categories)
    CategoryOptionsAPI.init(co)
    this.props.setCategoryOptions(co)
    this.props.setPathLengthMaximum(SegmentFN.getMaxPathLength(dataset))
    this.props.setPathLengthRange([0, SegmentFN.getMaxPathLength(dataset)])
    this.props.saveProjection(new Embedding(dataset.vectors, "Initial Projection"))
    this.props.setGenericFingerprintAttributes(DatasetUtil.getColumns(dataset, true).map(column => ({
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

    this.props.setProjectionColumns(DatasetUtil.getColumns(dataset, true).map(column => ({
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
            </React.Fragment>}><Tab value={1} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseProject}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, paddingTop: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} /></Tooltip>

            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Point and Line Channels</Typography>
              <Typography variant="body2">Contains settings that let you map different channels like brightness and color on point and line attributes.</Typography>
            </React.Fragment>}><Tab value={2} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseEncoding}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, paddingTop: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} /></Tooltip>

            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Groups</Typography>
              <Typography variant="body2">Contains options for displaying and navigating groups in the dataset.</Typography>
            </React.Fragment>}><Tab value={3} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseClusters}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, paddingTop: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} /></Tooltip>

            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Hover Item and Selection Summary</Typography>
              <Typography variant="body2">Contains information about the currently hovered item and the currently selected summary.</Typography>
            </React.Fragment>}><Tab value={4} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseDetails}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, paddingTop: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} /></Tooltip>

            {/* {frontend_utils.CHEM_PROJECT && <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Backend Settings</Typography>
              <Typography variant="body2">Adjust Settings used in the backend.</Typography>
            </React.Fragment>}><Tab icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseDetails}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>
            } */}
            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">LineUp Integration</Typography>
              <Typography variant="body2">Settings for LineUp Integration</Typography>
            </React.Fragment>}><Tab value={5} icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseLineup}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1, paddingTop: 16, paddingBottom: 16 }} /></Tooltip>
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
                <EmbeddingTabPanel
                  webGLView={this.threeRef}></EmbeddingTabPanel>
              </FixedHeightTabPanel>

              <FixedHeightTabPanel value={this.props.openTab} index={2}>
                <StatesTabPanel
                  webGLView={this.threeRef}
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

              {/* {frontend_utils.CHEM_PROJECT && 
              <FixedHeightTabPanel value={this.props.openTab} index={5}>
                <ChemTabPanel></ChemTabPanel>
              </FixedHeightTabPanel>} */}

              <FixedHeightTabPanel value={this.props.openTab} index={5}>
                <LineUpTabPanel splitRef={this.splitRef}></LineUpTabPanel>
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
              <LineUpContext onFilter={() => { this.threeRef.current.lineupFilterUpdate() }}></LineUpContext>
            </div>
          </Split>
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






const EntryPoint = () => {
  const api = new API()
  const [context, setContext] = React.useState(api)
  const [test, setTest] = React.useState('')

  api.onStateChanged = (values, keys) => {
  }



  return <div>
    <Button style={{ zIndex: 10000, position: 'absolute' }
    } onClick={() => {
      console.log(context.store.getState().lineUpInput)
      onClick(context.serialize())
    }}>store</Button>

    <Button style={{ zIndex: 10000, position: 'absolute', left: 100 }} onClick={async () => {
      const content = await loo()
      setContext(new API(content))
    }}>load</Button>
    <PSEContextProvider
      context={context}
      onStateChanged={(values, keys) => {
      }}
      
      >

      <Application config={{}} />
    </PSEContextProvider>
  </div>
}

// Render the application into our 'mountingPoint' div that is declared in 'index.html'.
ReactDOM.render(<EntryPoint></EntryPoint>, document.getElementById("mountingPoint"))