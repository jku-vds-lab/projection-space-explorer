"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const React = require("react");
const DatasetType_1 = require("../../../model/DatasetType");
const DatasetDatabase_1 = require("../../Utility/Data/DatasetDatabase");
const material_2 = require("@mui/material");
const MenuBook_1 = require("@mui/icons-material/MenuBook");
const Share_1 = require("@mui/icons-material/Share");
const Widgets_1 = require("@mui/icons-material/Widgets");
const HelpOutline_1 = require("@mui/icons-material/HelpOutline");
exports.TypeIcon = ({ type }) => {
    switch (type) {
        case DatasetType_1.DatasetType.Neural:
            return React.createElement(material_2.ListItemIcon, null,
                React.createElement(Share_1.default, null));
        case DatasetType_1.DatasetType.Story:
            return React.createElement(material_2.ListItemIcon, null,
                React.createElement(MenuBook_1.default, null));
        case DatasetType_1.DatasetType.Chess:
            return React.createElement(material_2.ListItemIcon, null,
                React.createElement(material_2.SvgIcon, { viewBox: "0 0 45 45" },
                    React.createElement("g", { style: { opacity: 1, fill: 'none', fillRule: 'evenodd', fillOpacity: 1, stroke: '#000000', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 } },
                        React.createElement("g", { style: { fill: '#000000', stroke: '#000000', strokeLinecap: 'butt' } },
                            React.createElement("path", { d: "M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z" }),
                            React.createElement("path", { d: "M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" }),
                            React.createElement("path", { d: "M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z" })),
                        React.createElement("path", { d: "M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18", style: { fill: 'none', stroke: '#ffffff', strokeLinejoin: 'miter' } }))));
        case DatasetType_1.DatasetType.Rubik:
            return React.createElement(material_2.ListItemIcon, null,
                React.createElement(Widgets_1.default, null));
        default:
            return React.createElement(material_2.ListItemIcon, null,
                React.createElement(HelpOutline_1.default, null));
    }
};
exports.PredefinedDatasets = ({ onChange }) => {
    var database = new DatasetDatabase_1.DatasetDatabase();
    var types = database.getTypes();
    var handleClick = (entry) => {
        onChange(entry);
    };
    return React.createElement(material_1.Grid, { item: true, style: { overflowY: 'auto', height: '100px', flex: '1 1 auto' } },
        React.createElement(material_1.List, { subheader: React.createElement("li", null), style: { backgroundColor: 'white' } }, types.map(type => {
            return React.createElement("li", { key: type, style: { backgroundColor: 'inherit' } },
                React.createElement("ul", { style: { backgroundColor: 'inherit', paddingInlineStart: '0px' } },
                    React.createElement(material_1.ListSubheader, null, Object.keys(DatasetType_1.DatasetType)[Object.values(DatasetType_1.DatasetType).indexOf(type)].replaceAll('_', ' ')),
                    database.data.filter(value => value.type == type).map(entry => {
                        return React.createElement(material_1.ListItem, { key: entry.path, button: true, onClick: () => {
                                handleClick(entry);
                            } },
                            React.createElement(exports.TypeIcon, { type: entry.type }),
                            React.createElement(material_1.ListItemText, { primary: entry.display }));
                    })));
        })));
};
