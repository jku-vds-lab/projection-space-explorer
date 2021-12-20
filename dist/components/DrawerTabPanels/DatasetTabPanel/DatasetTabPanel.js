"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const React = require("react");
const Vector_1 = require("../../../model/Vector");
const CSVLoader_1 = require("../../Utility/Loaders/CSVLoader");
const JSONLoader_1 = require("../../Utility/Loaders/JSONLoader");
const DatasetDrop_1 = require("./DatasetDrop");
const DownloadJob_1 = require("./DownloadJob");
const DownloadProgress_1 = require("./DownloadProgress");
const PredefinedDatasets_1 = require("./PredefinedDatasets");
const d3v5 = require("d3v5");
function convertFromCSV(vectors) {
    return vectors.map(vector => {
        return Vector_1.AVector.create(vector);
    });
}
function DatasetTabPanel({ onDataSelected }) {
    const [job, setJob] = React.useState(null);
    let predefined = React.createElement(PredefinedDatasets_1.PredefinedDatasets, { onChange: (entry) => {
            setJob(new DownloadJob_1.DownloadJob(entry));
        } });
    return React.createElement("div", { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
        React.createElement(material_1.Box, { paddingLeft: 2, paddingTop: 2 },
            React.createElement(material_1.Typography, { variant: "subtitle2", gutterBottom: true }, 'Custom Datasets (Drag and Drop)')),
        React.createElement(DatasetDrop_1.DatasetDrop, { onChange: onDataSelected }),
        React.createElement(material_1.Box, { paddingLeft: 2, paddingTop: 2 },
            React.createElement(material_1.Typography, { variant: "subtitle2", gutterBottom: true }, 'Predefined Datasets')),
        predefined,
        React.createElement(DownloadProgress_1.DownloadProgress, { job: job, onFinish: (result) => {
                if (job.entry.path.endsWith('json')) {
                    new JSONLoader_1.JSONLoader().resolve(JSON.parse(result), onDataSelected, job.entry.type, job.entry);
                }
                else {
                    new CSVLoader_1.CSVLoader().resolve(onDataSelected, convertFromCSV(d3v5.csvParse(result)), job.entry.type, job.entry);
                }
                setJob(null);
            }, onCancel: () => { setJob(null); } }));
}
exports.DatasetTabPanel = DatasetTabPanel;
