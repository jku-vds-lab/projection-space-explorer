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
export declare const StatesTabPanelFull: ({ selectedVectorByShape, vectorByShape, dataset, setSelectedVectorByShape, setVectorByShape, setCheckedShapes, categoryOptions, selectedLineBy, setSelectedLineBy, webGlView, channelBrightness, setChannelBrightness, setGlobalPointBrightness, channelSize, setChannelSize, setGlobalPointSize, channelColor, setChannelColor, setAdvancedColoringSelection }: Props) => JSX.Element;
export declare const StatesTabPanel: import("react-redux").ConnectedComponent<({ selectedVectorByShape, vectorByShape, dataset, setSelectedVectorByShape, setVectorByShape, setCheckedShapes, categoryOptions, selectedLineBy, setSelectedLineBy, webGlView, channelBrightness, setChannelBrightness, setGlobalPointBrightness, channelSize, setChannelSize, setGlobalPointSize, channelColor, setChannelColor, setAdvancedColoringSelection }: Props) => JSX.Element, Pick<Props, "webGlView">>;
export {};
/**
 *
         {
            categoryOptions != null && categoryOptions.hasCategory("size") ?
                <Grid
                    container
                    justify="center"
                    alignItems="stretch"
                    direction="column"
                    style={{ padding: '0 16px' }}>
                    <FormControl style={{ margin: '4px 0px' }}>
                        <InputLabel shrink id="vectorBySizeSelectLabel">{"size by"}</InputLabel>
                        <Select labelId="vectorBySizeSelectLabel"
                            id="vectorBySizeSelect"
                            displayEmpty
                            value={channelSize ? channelSize.key : ''}
                            onChange={(event) => {
                                var attribute = categoryOptions.getCategory("size").attributes.filter(a => a.key == event.target.value)[0]
                                if (attribute == undefined) {
                                    attribute = null
                                }
                                let pointSize = attribute ? [1, 2] : [1]
                                setGlobalPointSize(pointSize)
                                setChannelSize(attribute)
                                webGlView.current.particles.sizeCat(attribute, pointSize)
                            }}
                        >
                            <MenuItem value="">None</MenuItem>
                            {categoryOptions.getCategory("size").attributes.map(attribute => {
                                return <MenuItem key={attribute.key} value={attribute.key}>{attribute.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                :
                <div></div>
        }
 */ 
