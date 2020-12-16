import React = require("react");
import { Vect } from "../../Utility/Data/Vect";
import { CSVLoader } from "../../Utility/Loaders/CSVLoader";
import { JSONLoader } from "../../Utility/Loaders/JSONLoader";
import { SDFLoader } from "../../Utility/Loaders/SDFLoader";
import { DatasetDrop } from "./DatasetDrop";
import { DownloadJob } from "./DownloadJob";
import { DownloadProgress } from "./DownloadProgress";
import { PredefinedDatasets } from "./PredefinedDatasets";
var d3v5 = require('d3')

function convertFromCSV(vectors) {
    return vectors.map(vector => {
        return new Vect(vector)
    })
}

export function DatasetTabPanel({ onDataSelected }) {
    const [job, setJob] = React.useState(null)

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <DatasetDrop onChange={onDataSelected}></DatasetDrop>

        <PredefinedDatasets onChange={(entry) => {
            if(entry.path.endsWith('sdf')){
                new SDFLoader().resolvePath(entry, onDataSelected)
            }else{
                setJob(new DownloadJob(entry))
            }
        }} ></PredefinedDatasets>

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