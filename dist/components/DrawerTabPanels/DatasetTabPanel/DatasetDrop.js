"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const React = require("react");
const CSVLoader_1 = require("../../Utility/Loaders/CSVLoader");
const JSONLoader_1 = require("../../Utility/Loaders/JSONLoader");
const DragAndDrop_1 = require("./DragAndDrop");
exports.DatasetDrop = ({ onChange }) => {
    return React.createElement(material_1.Grid, { container: true, item: true, alignItems: "stretch", justifyContent: "center", direction: "column", style: { padding: '16px' } },
        React.createElement(DragAndDrop_1.default, { accept: "image/*", handleDrop: (files) => {
                if (files == null || files.length <= 0) {
                    return;
                }
                var file = files[0];
                var fileName = file.name;
                var reader = new FileReader();
                reader.onload = (event) => {
                    var content = event.target.result;
                    if (fileName.endsWith('json')) {
                        new JSONLoader_1.JSONLoader().resolveContent(content, onChange);
                    }
                    else {
                        new CSVLoader_1.CSVLoader().resolveContent(content, onChange);
                    }
                };
                reader.readAsText(file);
            } },
            React.createElement("div", { style: { height: 200 } })));
};
