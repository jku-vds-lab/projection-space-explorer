import "regenerator-runtime/runtime";
import { Dataset } from "./model/Dataset";
import * as React from "react";
import { ConnectedProps } from 'react-redux';
import { CategoryOptions } from "./components/WebGLView/CategoryOptions";
import { IBook } from "./model/Book";
/**
 * Factory method which is declared here so we can get a static type in 'ConnectedProps'
 */
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    openTab: any;
    dataset: Dataset;
    categoryOptions: CategoryOptions;
    channelSize: any;
    channelColor: any;
    channelBrightness: any;
    hoverStateOrientation: any;
} & {
    addStory: (story: any) => any;
    setActiveStory: (activeStory: IBook) => any;
    setOpenTab: (openTab: any) => any;
    setDataset: (dataset: any) => any;
    setAdvancedColoringSelection: (value: any) => any;
    setActiveLine: (value: any) => any;
    setProjectionColumns: (projectionColumns: any) => any;
    setProjectionOpen: (projectionOpen: any) => any;
    setClusterMode: (clusterMode: any) => any;
    setPathLengthMaximum: (maximum: any) => any;
    setPathLengthRange: (range: any) => any;
    setCategoryOptions: (categoryOptions: any) => any;
    setChannelSize: (channelSize: any) => any;
    setGlobalPointSize: (size: any) => any;
    wipeState: () => any;
    setChannelColor: (channelColor: any) => any;
    setChannelBrightness: (channelBrightness: any) => any;
    setLineUpInput_visibility: (input: any) => any;
    saveProjection: (embedding: any) => any;
    setVectors: (vectors: any) => any;
    setLineByOptions: (options: any) => any;
    setGlobalPointBrightness: (value: any) => any;
    setGenericFingerprintAttributes: (value: any) => any;
    setGroupVisualizationMode: (value: any) => any;
}, {}>;
/**
 * Type that holds the props we declared above in mapStateToProps and mapDispatchToProps
 */
declare type PropsFromRedux = ConnectedProps<typeof connector>;
export interface ApplicationConfig {
}
declare type Props = PropsFromRedux & {
    config: ApplicationConfig;
};
export declare var Test: number;
/**
 * Main application that contains all other components.
 */
export declare var Application: import("react-redux").ConnectedComponent<{
    new (props: any): {
        threeRef: any;
        splitRef: any;
        componentDidMount(): void;
        /**
         * Main callback when the dataset changes
         * @param dataset
         * @param json
         */
        onDataSelected(dataset: Dataset): void;
        finite(dataset: Dataset): void;
        initializeEncodings(dataset: any): void;
        onLineSelect(algo: any, show: any): void;
        onChangeTab(newTab: any): void;
        render(): JSX.Element;
        context: any;
        setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<Props> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<any>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<Props>, nextState: Readonly<any>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Props>, prevState: Readonly<any>): any;
        componentDidUpdate?(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<any>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<any>, nextContext: any): void;
    };
    contextType?: React.Context<any>;
}, Pick<React.ClassAttributes<{
    threeRef: any;
    splitRef: any;
    componentDidMount(): void;
    /**
     * Main callback when the dataset changes
     * @param dataset
     * @param json
     */
    onDataSelected(dataset: Dataset): void;
    finite(dataset: Dataset): void;
    initializeEncodings(dataset: any): void;
    onLineSelect(algo: any, show: any): void;
    onChangeTab(newTab: any): void;
    render(): JSX.Element;
    context: any;
    setState<K extends string | number | symbol>(state: any, callback?: () => void): void;
    forceUpdate(callback?: () => void): void;
    readonly props: Readonly<Props> & Readonly<{
        children?: React.ReactNode;
    }>;
    state: Readonly<any>;
    refs: {
        [key: string]: React.ReactInstance;
    };
    shouldComponentUpdate?(nextProps: Readonly<Props>, nextState: Readonly<any>, nextContext: any): boolean;
    componentWillUnmount?(): void;
    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
    getSnapshotBeforeUpdate?(prevProps: Readonly<Props>, prevState: Readonly<any>): any;
    componentDidUpdate?(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any): void;
    componentWillMount?(): void;
    UNSAFE_componentWillMount?(): void;
    componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
    UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
    componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<any>, nextContext: any): void;
    UNSAFE_componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<any>, nextContext: any): void;
}> & {
    openTab: any;
    dataset: Dataset;
    categoryOptions: CategoryOptions;
    channelSize: any;
    channelColor: any;
    channelBrightness: any;
    hoverStateOrientation: any;
} & {
    addStory: (story: any) => any;
    setActiveStory: (activeStory: IBook) => any;
    setOpenTab: (openTab: any) => any;
    setDataset: (dataset: any) => any;
    setAdvancedColoringSelection: (value: any) => any;
    setActiveLine: (value: any) => any;
    setProjectionColumns: (projectionColumns: any) => any;
    setProjectionOpen: (projectionOpen: any) => any;
    setClusterMode: (clusterMode: any) => any;
    setPathLengthMaximum: (maximum: any) => any;
    setPathLengthRange: (range: any) => any;
    setCategoryOptions: (categoryOptions: any) => any;
    setChannelSize: (channelSize: any) => any;
    setGlobalPointSize: (size: any) => any;
    wipeState: () => any;
    setChannelColor: (channelColor: any) => any;
    setChannelBrightness: (channelBrightness: any) => any;
    setLineUpInput_visibility: (input: any) => any;
    saveProjection: (embedding: any) => any;
    setVectors: (vectors: any) => any;
    setLineByOptions: (options: any) => any;
    setGlobalPointBrightness: (value: any) => any;
    setGenericFingerprintAttributes: (value: any) => any;
    setGroupVisualizationMode: (value: any) => any;
} & {
    config: ApplicationConfig;
}, "ref" | "config" | "key">>;
export {};
/**const onClick = async (content: string) => {
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
PluginRegistry.getInstance().registerPlugin(new CoralPlugin())
PluginRegistry.getInstance().registerPlugin(new ChemPlugin())
PluginRegistry.getInstance().registerPlugin(new GoPlugin())




const EntryPoint = () => {
  const api = new API()
  const [context, setContext] = React.useState(api)

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
ReactDOM.render(<EntryPoint></EntryPoint>, document.getElementById("mountingPoint"))**/ 
