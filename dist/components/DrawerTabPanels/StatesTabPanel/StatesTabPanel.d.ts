import { ConnectedProps } from 'react-redux';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    selectedVectorByShape: any;
    selectedLineBy: {
        options: any[];
        value: any;
    } | {
        options: any;
        value: string;
    };
    vectorByShape: any;
    dataset: import("../../..").Dataset;
    categoryOptions: import("../../WebGLView/CategoryOptions").CategoryOptions;
    channelBrightness: any;
    channelSize: any;
    channelColor: any;
} & {
    setSelectedVectorByShape: (selectedVectorByShape: any) => any;
    setVectorByShape: (vectorByShape: any) => any;
    setCheckedShapes: (checkedShapes: any) => any;
    setSelectedLineBy: (lineBy: any) => any;
    setChannelBrightness: (value: any) => any;
    setGlobalPointBrightness: (value: any) => any;
    setChannelSize: (value: any) => any;
    setGlobalPointSize: (value: any) => any;
    setChannelColor: (value: any) => any;
    setAdvancedColoringSelection: (value: any) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    webGlView: any;
};
export declare const SelectFeatureComponent: ({ label, default_val, categoryOptions, onChange }: any) => JSX.Element;
export declare const StatesTabPanelFull: ({ selectedVectorByShape, vectorByShape, dataset, setSelectedVectorByShape, setVectorByShape, setCheckedShapes, categoryOptions, selectedLineBy, setSelectedLineBy, webGlView, channelBrightness, setChannelBrightness, setGlobalPointBrightness, channelSize, setChannelSize, setGlobalPointSize, channelColor, setChannelColor, setAdvancedColoringSelection }: Props) => JSX.Element;
export declare const StatesTabPanel: import("react-redux").ConnectedComponent<({ selectedVectorByShape, vectorByShape, dataset, setSelectedVectorByShape, setVectorByShape, setCheckedShapes, categoryOptions, selectedLineBy, setSelectedLineBy, webGlView, channelBrightness, setChannelBrightness, setGlobalPointBrightness, channelSize, setChannelSize, setGlobalPointSize, channelColor, setChannelColor, setAdvancedColoringSelection }: Props) => JSX.Element, Pick<Props, "webGlView">>;
export {};
