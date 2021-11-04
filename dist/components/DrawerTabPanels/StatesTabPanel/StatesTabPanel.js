"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const React = require("react");
const material_1 = require("@mui/material");
const ShapeLegend_1 = require("./ShapeLegend");
const SelectedVectorByShapeDuck_1 = require("../../Ducks/SelectedVectorByShapeDuck");
const VectorByShapeDuck_1 = require("../../Ducks/VectorByShapeDuck");
const CheckedShapesDuck_1 = require("../../Ducks/CheckedShapesDuck");
const SelectedLineByDuck_1 = require("../../Ducks/SelectedLineByDuck");
const ChannelBrightnessDuck_1 = require("../../Ducks/ChannelBrightnessDuck");
const GlobalPointBrightnessDuck_1 = require("../../Ducks/GlobalPointBrightnessDuck");
const BrightnessSlider_1 = require("./BrightnessSlider");
const ChannelSize_1 = require("../../Ducks/ChannelSize");
const GlobalPointSizeDuck_1 = require("../../Ducks/GlobalPointSizeDuck");
const SizeSlider_1 = require("./SizeSlider");
const ColorScaleSelect_1 = require("./ColorScaleSelect");
const AdvancedColoringPopover_1 = require("./AdvancedColoringPopover");
const ChannelColorDuck_1 = require("../../Ducks/ChannelColorDuck");
const AdvancedColoringSelectionDuck_1 = require("../../Ducks/AdvancedColoringSelectionDuck");
const PathLengthFilter_1 = require("./PathLengthFilter");
const PathBrightnessSlider_1 = require("./PathBrightnessSlider");
const ExpandMore_1 = require("@mui/icons-material/ExpandMore");
const CategoryOptions_1 = require("../../WebGLView/CategoryOptions");
const styles_1 = require("@mui/styles");
const mapStateToProps = (state) => ({
    selectedVectorByShape: state.selectedVectorByShape,
    selectedLineBy: state.selectedLineBy,
    vectorByShape: state.vectorByShape,
    dataset: state.dataset,
    categoryOptions: state.categoryOptions,
    channelBrightness: state.channelBrightness,
    channelSize: state.channelSize,
    channelColor: state.channelColor
});
const mapDispatchToProps = dispatch => ({
    setSelectedVectorByShape: selectedVectorByShape => dispatch(SelectedVectorByShapeDuck_1.setSelectedVectorByShapeAction(selectedVectorByShape)),
    setVectorByShape: vectorByShape => dispatch(VectorByShapeDuck_1.setVectorByShapeAction(vectorByShape)),
    setCheckedShapes: checkedShapes => dispatch(CheckedShapesDuck_1.setCheckedShapesAction(checkedShapes)),
    setSelectedLineBy: lineBy => dispatch(SelectedLineByDuck_1.setSelectedLineBy(lineBy)),
    setChannelBrightness: value => dispatch(ChannelBrightnessDuck_1.setChannelBrightnessSelection(value)),
    setGlobalPointBrightness: value => dispatch(GlobalPointBrightnessDuck_1.setGlobalPointBrightness(value)),
    setChannelSize: value => dispatch(ChannelSize_1.setChannelSize(value)),
    setGlobalPointSize: value => dispatch(GlobalPointSizeDuck_1.setGlobalPointSize(value)),
    setChannelColor: value => dispatch(ChannelColorDuck_1.setChannelColor(value)),
    setAdvancedColoringSelection: value => dispatch(AdvancedColoringSelectionDuck_1.setAdvancedColoringSelectionAction(value))
});
const connector = react_redux_1.connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true });
/**
 

        {
            <FormControl style={{ margin: '4px 0px' }}>
                <InputLabel shrink id="lineByLabel">{"line by"}</InputLabel>
                <Select labelId="lineByLabel"
                    id="lineBySelect"
                    displayEmpty
                    value={selectedLineBy.value}
                    onChange={(event) => {
                        setSelectedLineBy(event.target.value)
                        webGlView.current.recreateLines(event.target.value)
                    }}
                >
                    <MenuItem value="">None</MenuItem>
                    {
                        selectedLineBy.options.map((option, i) => {
                            return <MenuItem key={option} value={option}>{option}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        }

 */
const useStyles = styles_1.makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        //fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
    //fontSize: theme.typography.pxToRem(15),
    //color: theme.palette.text.secondary,
    },
    details: {
        padding: '0px',
        display: 'flex',
        flexDirection: 'column'
    }
}));
exports.StatesTabPanelFull = ({ selectedVectorByShape, vectorByShape, dataset, setSelectedVectorByShape, setVectorByShape, setCheckedShapes, categoryOptions, selectedLineBy, setSelectedLineBy, webGLView, channelBrightness, setChannelBrightness, setGlobalPointBrightness, channelSize, setChannelSize, setGlobalPointSize, channelColor, setChannelColor, setAdvancedColoringSelection }) => {
    if (dataset == null) {
        return null;
    }
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const points_box = React.createElement(material_1.Box, null,
        categoryOptions != null && CategoryOptions_1.CategoryOptionsAPI.hasCategory(categoryOptions, "shape") ?
            React.createElement(material_1.Grid, { container: true, justifyContent: "center", alignItems: "stretch", direction: "column", style: { padding: '0 16px' } },
                React.createElement(material_1.FormControl, { style: { margin: '4px 0px' } },
                    React.createElement(material_1.FormHelperText, null, "shape by"),
                    React.createElement(material_1.Select, { displayEmpty: true, size: 'small', id: "vectorByShapeSelect", value: selectedVectorByShape, onChange: (event) => {
                            setSelectedVectorByShape(event.target.value);
                            if (event.target.value != null && event.target.value != "") {
                                var attribute = CategoryOptions_1.CategoryOptionsAPI.getCategory(categoryOptions, "shape").attributes.filter(a => a.key == event.target.value)[0];
                                setVectorByShape(attribute);
                            }
                            else {
                                setVectorByShape(null);
                            }
                        } },
                        React.createElement(material_1.MenuItem, { value: "" },
                            React.createElement("em", null, "None")),
                        CategoryOptions_1.CategoryOptionsAPI.getCategory(categoryOptions, "shape").attributes.map(attribute => {
                            return React.createElement(material_1.MenuItem, { key: attribute.key, value: attribute.key }, attribute.name);
                        }))))
            :
                React.createElement("div", null),
        React.createElement(material_1.Grid, { item: true, style: { padding: '0 16px' } },
            React.createElement(ShapeLegend_1.ShapeLegend, { dataset: dataset, category: vectorByShape, onChange: (checkboxes) => {
                    setCheckedShapes(checkboxes);
                } })),
        categoryOptions != null && CategoryOptions_1.CategoryOptionsAPI.hasCategory(categoryOptions, "transparency") ?
            React.createElement(material_1.Grid, { container: true, justifyContent: "center", alignItems: "stretch", direction: "column", style: { padding: '0 16px' } },
                React.createElement(material_1.FormControl, { style: { margin: '4px 0px' } },
                    React.createElement(material_1.FormHelperText, null, "brightness by"),
                    React.createElement(material_1.Select, { displayEmpty: true, size: 'small', value: channelBrightness ? channelBrightness.key : '', onChange: (event) => {
                            var attribute = CategoryOptions_1.CategoryOptionsAPI.getCategory(categoryOptions, "transparency").attributes.filter(a => a.key == event.target.value)[0];
                            if (attribute == undefined) {
                                attribute = null;
                            }
                            let pointBrightness = attribute ? [0.25, 1] : [1];
                            setGlobalPointBrightness(pointBrightness);
                            setChannelBrightness(attribute);
                            webGLView.current.particles.transparencyCat(attribute, pointBrightness);
                            webGLView.current.requestRender();
                        } },
                        React.createElement(material_1.MenuItem, { value: "" },
                            React.createElement("em", null, "None")),
                        CategoryOptions_1.CategoryOptionsAPI.getCategory(categoryOptions, "transparency").attributes.map(attribute => {
                            return React.createElement(material_1.MenuItem, { key: attribute.key, value: attribute.key }, attribute.name);
                        }))))
            :
                React.createElement("div", null),
        React.createElement(BrightnessSlider_1.BrightnessSlider, null),
        categoryOptions != null && CategoryOptions_1.CategoryOptionsAPI.hasCategory(categoryOptions, "size") ?
            React.createElement(material_1.Grid, { container: true, justifyContent: "center", alignItems: "stretch", direction: "column", style: { padding: '0 16px' } },
                React.createElement(material_1.FormControl, { style: { margin: '4px 0px' } },
                    React.createElement(material_1.FormHelperText, null, "size by"),
                    React.createElement(material_1.Select, { id: "vectorBySizeSelect", displayEmpty: true, size: 'small', value: channelSize ? channelSize.key : '', onChange: (event) => {
                            var attribute = CategoryOptions_1.CategoryOptionsAPI.getCategory(categoryOptions, "size").attributes.filter(a => a.key == event.target.value)[0];
                            if (attribute == undefined) {
                                attribute = null;
                            }
                            let pointSize = attribute ? [1, 2] : [1];
                            setGlobalPointSize(pointSize);
                            setChannelSize(attribute);
                            webGLView.current.particles.sizeCat(attribute, pointSize);
                        } },
                        React.createElement(material_1.MenuItem, { value: "" },
                            React.createElement("em", null, "None")),
                        CategoryOptions_1.CategoryOptionsAPI.getCategory(categoryOptions, "size").attributes.map(attribute => {
                            return React.createElement(material_1.MenuItem, { key: attribute.key, value: attribute.key }, attribute.name);
                        }))))
            :
                React.createElement("div", null),
        React.createElement(SizeSlider_1.SizeSlider, null),
        categoryOptions != null && CategoryOptions_1.CategoryOptionsAPI.hasCategory(categoryOptions, "color") ?
            React.createElement(material_1.Grid, { container: true, item: true, alignItems: "stretch", direction: "column", style: { padding: '0 16px' } },
                React.createElement(material_1.Grid, { container: true, item: true, alignItems: "stretch", direction: "column" },
                    React.createElement(material_1.FormControl, { style: { margin: '4px 0px' } },
                        React.createElement(material_1.FormHelperText, null, "color by"),
                        React.createElement(material_1.Select, { id: "vectorByColorSelect", displayEmpty: true, size: 'small', value: channelColor ? channelColor.key : "", onChange: (event) => {
                                var attribute = null;
                                if (event.target.value != "") {
                                    attribute = CategoryOptions_1.CategoryOptionsAPI.getCategory(categoryOptions, "color").attributes.filter(a => a.key == event.target.value)[0];
                                }
                                setAdvancedColoringSelection(new Array(10000).fill(true));
                                setChannelColor(attribute);
                            } },
                            React.createElement(material_1.MenuItem, { value: "" },
                                React.createElement("em", null, "None")),
                            CategoryOptions_1.CategoryOptionsAPI.getCategory(categoryOptions, "color").attributes.map(attribute => {
                                return React.createElement(material_1.MenuItem, { key: attribute.key, value: attribute.key }, attribute.name);
                            })))))
            :
                React.createElement("div", null),
        React.createElement(material_1.Grid, { item: true },
            React.createElement(ColorScaleSelect_1.ColorScaleSelect, null)),
        React.createElement(material_1.Grid, { item: true, style: { padding: '16px 0px' } }, channelColor != null && channelColor.type == 'categorical' ?
            React.createElement(AdvancedColoringPopover_1.AdvancedColoringPopover, null)
            :
                React.createElement("div", null)));
    const accordion = React.createElement("div", { style: {} },
        dataset.isSequential && React.createElement(material_1.Accordion, { expanded: expanded === 'panel1', onChange: handleChange('panel1') },
            React.createElement(material_1.AccordionSummary, { expandIcon: React.createElement(ExpandMore_1.default, null), "aria-controls": "panel1bh-content", id: "panel1bh-header" },
                React.createElement(material_1.Typography, { className: classes.heading }, "Lines")),
            React.createElement(material_1.AccordionDetails, { className: classes.details }, dataset && dataset.isSequential && React.createElement("div", null,
                React.createElement(material_1.Grid, { container: true, justifyContent: "center", alignItems: "stretch", direction: "column", style: { padding: '0 16px' } },
                    React.createElement(material_1.Box, { p: 1 })),
                React.createElement("div", { style: { margin: '8px 0px' } }),
                React.createElement(PathLengthFilter_1.PathLengthFilter, null),
                React.createElement(PathBrightnessSlider_1.PathBrightnessSlider, null)))),
        React.createElement(material_1.Accordion, { expanded: expanded === 'panel2' || !dataset.isSequential, onChange: handleChange('panel2') },
            React.createElement(material_1.AccordionSummary, { expandIcon: React.createElement(ExpandMore_1.default, null), "aria-controls": "panel1bh-content", id: "panel1bh-header" },
                React.createElement(material_1.Typography, { className: classes.heading }, "Points")),
            React.createElement(material_1.AccordionDetails, { className: classes.details }, points_box)));
    return React.createElement("div", null, dataset && dataset.isSequential ? accordion : points_box);
};
exports.StatesTabPanel = connector(exports.StatesTabPanelFull);
