"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_1 = require("@mui/material");
const react_redux_1 = require("react-redux");
const Delete_1 = require("@mui/icons-material/Delete");
const Book_1 = require("../../../model/Book");
const StoriesDuck_1 = require("../../Ducks/StoriesDuck");
const mapStateToProps = (state) => ({
    stories: state.stories
});
const mapDispatchToProps = dispatch => ({
    setActiveStory: activeStory => dispatch(StoriesDuck_1.setActiveStory(activeStory)),
    deleteStory: story => dispatch(StoriesDuck_1.deleteStory(story)),
    addStory: (story) => dispatch(StoriesDuck_1.addStory(story, true))
});
const connector = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
exports.StoryPreview = connector(({ stories, setActiveStory, deleteStory, addStory }) => {
    var _a;
    const deleteHandler = (story) => {
        if (stories.active == story) {
            setActiveStory(null);
        }
        deleteStory(story);
    };
    const addHandler = () => {
        addStory(Book_1.ABook.createEmpty());
    };
    return React.createElement("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'stretch'
        } },
        React.createElement(material_1.FormControl, null,
            React.createElement(material_1.FormHelperText, null, "Active Story Book"),
            React.createElement(material_1.Select, { displayEmpty: true, size: 'small', value: (_a = stories.active) !== null && _a !== void 0 ? _a : '', onChange: (event) => {
                    setActiveStory(event.target.value);
                } },
                React.createElement(material_1.ListItem, Object.assign({ key: -1 }, { value: null }, { button: true }),
                    React.createElement(material_1.ListItemText, { primary: "None" })),
                stories.stories && stories.stories.map((story, key) => {
                    return React.createElement(material_1.ListItem, Object.assign({ key: key, button: true }, { value: key }),
                        React.createElement(material_1.ListItemText, { primary: "Story Book", secondary: `${Object.keys(story.clusters.byId).length} nodes` }),
                        React.createElement(material_1.ListItemSecondaryAction, null,
                            React.createElement(material_1.IconButton, { edge: "end", "aria-label": "delete", onClick: () => {
                                    deleteHandler(story);
                                } },
                                React.createElement(Delete_1.default, null))));
                }))),
        React.createElement(material_1.Grid, { container: true, direction: "row", alignItems: "center", justifyContent: "space-between" },
            React.createElement(material_1.Button, { style: {
                    marginTop: '16px'
                }, onClick: () => addHandler(), variant: "outlined", size: "small", "aria-label": "move selected left" }, "Add Empty")));
});
