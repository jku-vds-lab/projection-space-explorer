import { Box, Typography } from "@mui/material";
import React = require("react");
import { Dataset } from "../../../model/Dataset";
import { AVector } from "../../../model/Vector";
import { CSVLoader } from "../../Utility/Loaders/CSVLoader";
import { JSONLoader } from "../../Utility/Loaders/JSONLoader";
import { DatasetDrop } from "./DatasetDrop";
import { DownloadJob } from "./DownloadJob";
import { DownloadProgress } from "./DownloadProgress";
import { PredefinedDatasets } from "./PredefinedDatasets";
import * as d3v5 from 'd3v5';

function convertFromCSV(vectors) {
    return vectors.map(vector => {
        return AVector.create(vector)
    })
}

export function DatasetTabPanel({ onDataSelected }: { onDataSelected(dataset: Dataset): void; }) {
    const [job, setJob] = React.useState(null)
    
    let predefined = <PredefinedDatasets onChange={(entry) => {
        setJob(new DownloadJob(entry))
    }} ></PredefinedDatasets>


    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>


        <Box paddingLeft={2} paddingTop={2}>
            <Typography variant="subtitle2" gutterBottom>{'Custom Datasets (Drag and Drop)'}</Typography>
        </Box>


        <DatasetDrop
            onChange={onDataSelected} />



        <Box paddingLeft={2} paddingTop={2}>
            <Typography variant="subtitle2" gutterBottom>{'Predefined Datasets'}</Typography>
        </Box>

        {predefined}

        <DownloadProgress job={job} onFinish={(result) => {
            if (job.entry.path.endsWith('json')) {
                new JSONLoader().resolve(JSON.parse(result), onDataSelected, job.entry.type, job.entry)
            } else {
                new CSVLoader().resolve(onDataSelected, convertFromCSV(d3v5.csvParse(result)), job.entry.type, job.entry)
            }

            setJob(null)
        }} onCancel={() => { setJob(null) }}></DownloadProgress>
    </div>
}

